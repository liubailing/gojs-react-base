/* eslint-disable camelcase */
/* eslint-disable accessor-pairs */
/* eslint-disable complexity */
import go from 'gojs';
import { observable } from 'mobx';
import flowchartStore from './flowchartStore';
import { IDiagramHander, IFlowchartHander, IDiagramModel, INodeModel, ILineModel, INodeEvent } from '../interface';
import { HandleEnum, NodeEnum } from '../enum';
import { NodeStore, LineStore } from '../store';
import { FlowchartModel } from '../model';

export default class HanderFlowchart extends flowchartStore implements IDiagramHander {
	/** 调用 对外的暴露的接口方法 */
	flowchartHander: IFlowchartHander;
	flowchartDiagram: go.Diagram | null = null;

	/**
	 * 设置选中节点后并触发 click,
	 * 为false的时候不触发click
	 */
	private preClickNodeKey = '';

	/**
	 * 设置选中节点后并触发 click,
	 * 为false的时候不触发click
	 */
	private setNodeSelected_OnClick = true;
	private _willSelectedNodeKey = '';

	/**
	 * 设置被复制的节点
	 * 为false的时候不触发click
	 */
	private _willCopyNodeId = '';
	/**
	 * 要剪切的节点
	 */
	private _willCutNodeId = '';
	/**
	 * 是否只复制一次
	 */
	private _isCopyOnce = false;

	constructor(handles: IFlowchartHander) {
		super();
		// this.dat.cacheNodeData = new Map<string, object>();
		this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handFlowchartEvent = this.handFlowchartEvent.bind(this);
		this.flowchartHander = handles;
	}

	data: IDiagramModel<INodeModel, ILineModel> | null = null;

	@observable nodeDataArray: Array<INodeModel> = [];
	@observable linkDataArray: Array<ILineModel> = [];
	@observable modelData: go.ObjectData = {};
	@observable selectedData: go.ObjectData | null = null;
	@observable skipsDiagramUpdate: boolean = false;

	/**
	 * Handle any relevant DiagramEvents, in this case just selection changes.
	 * On ChangedSelection, find the corresponding data and set the selectedData state.
	 * @param e a GoJS DiagramEvent
	 */
	public handleDiagramEvent(e: go.DiagramEvent) {
		const { name } = e;
		switch (name) {
			case 'ChangedSelection': {
				const sel = e.subject.first();
				if (sel) {
					if (sel instanceof go.Node) {
						const node = this.mapNode.get(sel.key as string);
						if (node && this.setNodeSelected_OnClick && this.flowchartHander.handlerClickNode) {
							if (this.preClickNodeKey !== node.key) {
								this.flowchartHander.handlerClickNode(node);
								this.preClickNodeKey = node.key;
							}
						}
					} else if (sel instanceof go.Group) {
						const node = this.mapNode.get(sel.key as string);
						if (node && this.setNodeSelected_OnClick && this.flowchartHander.handlerClickNode) {
							if (this.preClickNodeKey !== node.key) {
								this.flowchartHander.handlerClickNode(node);
								this.preClickNodeKey = node.key;
							}
						}
					}
				} else {
					// draft.selectedData = null;
				}
				// 恢复默认值
				this.setNodeSelected_OnClick = true;
				break;
			}
			default:
				// console.log('>>>>>>>> handleDiagramEvent.', name);
				break;
		}
	}

	/**
	 * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
	 * This method iterates over those changes and updates state to keep in sync with the GoJS model.
	 * @param obj a JSON-formatted string
	 */
	public handleModelChange(obj: go.IncrementalData) {
		// console.log(`>>>>>>> chenged model`, obj);
	}

	/**
	 * Handle inspector changes, and on input field blurs, update node/link data state.
	 * @param path the path to the property being modified
	 * @param value the new value of that property
	 * @param isBlur whether the input event was a blur, indicating the edit is complete
	 */
	public handleInputChange(path: string, value: string, isBlur: boolean) {}

	/**
	 * Handle changes to the checkbox on whether to allow relinking.
	 * @param e a change event from the checkbox
	 */
	public handleRelinkChange(e: any) {
		// console.log(`>>>>>>> handleRelinkChange`);
		// this.props.flowchart.handleModelChange(e);
		// const target = e.target;
		// const value = target.checked;
		// this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
	}

	init(fcdata: FlowchartModel) {
		// this.selectedData = this.nodeDataArray.filter((x) => x.label == '提取数据');
		super.refresData(fcdata);
		this._refresDiagram();
	}

	/**
	 * 监听到流程图操作
	 */
	handFlowchartEvent(e: INodeEvent) {
		const node: INodeModel = e.node ? e.node : NodeStore.baseModel;
		const line: ILineModel = e.line ? e.line : LineStore.getLink('', '', '');
		let pos;
		switch (e.eType) {
			case HandleEnum.Init:
				this.flowchartHander.handlerInit();
				break;
			case HandleEnum.ReRender:
				if (this.setNodeSelected_OnClick && this._willSelectedNodeKey) {
					this._setNodeSelected(this._willSelectedNodeKey);
				}
				break;
			/** 打开点菜单 */
			case HandleEnum.ShowNodeMenu:
				pos = this._getPostion;
				this.flowchartHander.handlerShowNodeMenu(node, pos.x, pos.y);
				break;
			case HandleEnum.ShowNodeInfo:
				pos = this._getPostion;
				this.flowchartHander.handlerShowNodeInfo(node, pos.x, pos.y);
				break;
			case HandleEnum.ShowNodeSetting:
				pos = this._getPostion;
				this.flowchartHander.handlerShowNodeSetting(node, pos.x, pos.y);
				break;
			case HandleEnum.ShowLineMenu:
				pos = this._getPostion;
				this.flowchartHander.handlerShowLineMenu(line, pos.x, pos.y);
				break;
			case HandleEnum.HideContextMenu:
				this._hideContextMenu();
				break;
			case HandleEnum.AddBranchToLeft:
				this.onAdd2Pre8NodeId(node.key, NodeEnum.Branch);
				break;
			case HandleEnum.AddBranchToRight:
				this.onAdd2Next8NodeId(node.key, NodeEnum.Branch);
				break;
			case HandleEnum.DragNode2Link:
				if (e.toLine) {
					this.onDragNode2Node(node.key, e.toLine.from);
				}
				break;
			case HandleEnum.DeleteNode:
				if (node && node.type === NodeEnum.Branch) {
					// 如果就一个分支 则不删除该分支
					const brother = this.mapNodeBrotherKeys.get(node.key);
					if (brother && brother.length === 1) {
						return false;
					}
				}
				this.onRemoveNode(node.key);
				break;
			case HandleEnum.CopyNode:
				// 分支条件不支持复制
				if (node && node.type !== NodeEnum.Branch) {
					this.onCopyNode(node.key);
				}
				break;
			case HandleEnum.Copy2PasteNode:
				if (node) {
					this.onPaste2Node(node.key);
				}
				break;
			case HandleEnum.CutNode:
				// 分支条件不支持剪切
				if (node && node.type !== NodeEnum.Branch) {
					this.onCutNode(node.key);
				}
				break;
			case HandleEnum.Cut2PasteNode:
				if (node && this._willCutNodeId && node.type !== NodeEnum.Branch) {
					this.onDragNode2Node(this._willCutNodeId, node.key);
					this._willCutNodeId = '';
				}
				break;
			default:
				break;
		}
	}

	handleGetDiagram = (d: go.Diagram) => {
		if (d) {
			this.flowchartDiagram = d;
		}
	};

	/**
	 * 往后新增节点，依据nodeId
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型
	 */
	onAdd2Next8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this.add2Next8NodeId(nodeId || 'start', type);
		if (res) {
			this._refresDiagram();
			const resNode = this.mapNode.get(res);
			if (resNode) {
				this.flowchartHander.handlerAddNode(resNode, false);
			}
			return res;
		}
		return '';
	}

	/**
	 * 往前面新增节点，依据nodeId
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型
	 */
	onAdd2Pre8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this.add2Pre8NodeId(nodeId, type);
		if (res) {
			this._refresDiagram();
			const resNode = this.mapNode.get(res);
			if (resNode) {
				this.flowchartHander.handlerAddNode(resNode, false);
			}
			return res;
		}
		return res;
	}

	/**
	 * 往内部 新增节点，依据nodeid
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型, 必须是 nodeId属于 条件，循环，分支
	 */
	onAdd2InnerTail8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this.add2InnerTail8NodeId(nodeId, type);
		if (res) {
			this._refresDiagram();
			const resNode = this.mapNode.get(res);
			if (resNode) {
				this.flowchartHander.handlerAddNode(resNode, false);
			}
			return res;
		}
		return res;
		// return false;
	}

	/**
	 * 往内部的头部 新增节点，依据nodeid
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型, 必须是 nodeId属于 条件，循环，分支
	 */
	onAdd2InnerHeader8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this.add2InnerHeader8NodeId(nodeId, type);
		if (res) {
			this._refresDiagram();
			const resNode = this.mapNode.get(res);
			if (resNode) {
				this.flowchartHander.handlerAddNode(resNode, false);
			}
			return res;
		}
		return '';
	}

	/**
	 * 在一个节点外面追加一个循环
	 * *注意* 不能是分支节点
	 * @param nodekey
	 */
	onAdd2InnerLoop8NodeId(nodeId: string): string {
		const res = this.add2InnerLoop8NodeId(nodeId);
		if (res) {
			this._refresDiagram();
			const resNode = this.mapNode.get(res);
			if (resNode) {
				this.flowchartHander.handlerAddNode(resNode, false);
			}
			return res;
		}
		return '';
	}

	/**
	 * 移除
	 * @param nodekey
	 */
	onRemoveNode(nodekey: string, clearData: boolean = true) {
		const currNode = this.mapNode.get(nodekey);
		if (currNode) {
			const res = this.remove8NodeId(nodekey);
			const pre = this.mapNodePreNodeKey.get(nodekey);
			if (res) {
				// 删除节点缓存数据
				if (clearData) {
					this.cacheNodeData.delete(nodekey);
				}
				let currkey = pre || '';
				// 说明删除的第一个节点
				//  如果是第一个条件分支
				if (pre === '' && currNode.type === NodeEnum.Branch) {
					currkey = currNode.group;
				} else if (pre) {
					const preNode = this.mapNode.get(pre);
					// 如果是循环里面第一个接节点
					if (preNode && preNode.type === NodeEnum.SubOpen) {
						currkey = currNode.group;
					} else if (preNode && preNode.type === NodeEnum.Start) {
						// 如果是第一个节点

						const brothers = this.mapNodeBrotherKeys.get(nodekey);
						if (brothers && brothers.length > 3) {
							currkey = brothers[2];
						} else {
							currkey = '';
						}
					}
				}
				this._refresDiagram();
				this.flowchartHander.handlerDeleteNode(currkey, nodekey);
			}
			return res;
		}
	}

	/**
	 * 拖拽
	 * @param nodekey
	 * @param toNodekey
	 */
	onDragNode2Node(nodekey: string, toNodekey: string) {
		const res = this.removeNode2Node(nodekey, toNodekey);
		if (res) {
			this._refresDiagram();
			this.flowchartHander.handlerDrag(nodekey);
		}
		return res;
	}

	/**
	 * 复制此节点
	 * @param nodekey 要复制的nodeId
	 * @param isCopyOnce 是否只复制一次，
	 */
	onCopyNode(nodekey: string, setHight: boolean = false, isCopyOnce: boolean = false) {
		this._willCopyNodeId = nodekey;
		this._isCopyOnce = isCopyOnce;
		if (setHight && this.flowchartDiagram) {
			const node = this.flowchartDiagram.findNodeForKey(nodekey);
			if (node && node.part && node.part.data) {
				node.opacity = 0.7;
			}
		}
		return true;
	}

	/**
	 * 复制此节点
	 * @param nodekey 要复制的nodeId
	 * @param isCopyOnce 是否只复制一次，
	 */
	onCutNode(nodekey: string, setHight: boolean = false) {
		this._willCutNodeId = nodekey;
		if (setHight && this.flowchartDiagram) {
			const node = this.flowchartDiagram.findNodeForKey(nodekey);
			if (node && node.part && node.part.data) {
				node.opacity = 0.7;
			}
		}
		return true;
	}

	/**
	 * 黏贴到节点
	 * @param toNodekey 要黏贴到的nodeId
	 */
	onPaste2Node(toNodekey: string) {
		if (!this._willCopyNodeId) {
			return;
		}
		const resNodekey = this.copyNode2Node(this._willCopyNodeId, toNodekey);
		if (resNodekey) {
			this._refresDiagram();
			this.flowchartHander.handlerPaste(resNodekey);
		}

		// 如果只复制一次
		if (this._isCopyOnce) {
			this._willCopyNodeId = '';
		}
		return resNodekey;
	}

	/**
	 * 复制 和 黏贴
	 * 重点注意 *当复制到循环时候，默认追加到循环的内部
	 * @param nodekey
	 * @param toNodekey
	 */
	onCopyNode2PasteNode(nodekey: string, toNodekey: string) {
		const resNodekey = this.copyNode2Node(nodekey, toNodekey);
		if (resNodekey) {
			this._refresDiagram();
			this.flowchartHander.handlerPaste(resNodekey);
		}
		return resNodekey;
	}

	/**
	 * 复制 和 黏贴
	 * 重点注意 *当复制到循环时候，默认追加到循环的内部
	 * @param nodekey
	 * @param toNodekey
	 */
	onCutNode2PasteNode(toNodekey: string) {
		const node = this.onGetNode(toNodekey);
		if (node && this._willCutNodeId && node.type !== NodeEnum.Branch) {
			this.onDragNode2Node(this._willCutNodeId, node.key);
			this._willCutNodeId = '';
		}
	}

	_hideContextMenu() {
		if (this.flowchartDiagram) {
			// this.flowchartDiagram.commandHandler.showContextMenu();
			// this.flowchartDiagram.currentTool.doCancel();
			this.flowchartDiagram.commandHandler.doKeyDown();
			this.flowchartHander.handlerHideContextMenu();
			// this.flowchartHander.toolManager.contextMenuTool.doCancel();
			this.flowchartDiagram.commandHandler.doKeyDown();
		}
	}

	/**
	 * 缓存节点配置数据
	 * @param nodekey
	 * @param data
	 */
	onSetNodeData(nodekey: string, data: object) {
		if (data && Object.keys(data).length > 0) {
			this.cacheNodeData.set(nodekey, data);
		}
	}

	/**
	 * 取得节点配置数据
	 * @param nodekey
	 * @param data
	 */
	onGetNodeData(nodekey: string, shouldHander: boolean = true): object | null {
		if (nodekey) {
			const data = this.cacheNodeData.get(nodekey);
			if (data && Object.keys(data).length > 0) {
				if (shouldHander) {
					this.flowchartHander.handlerGetNodeData(data);
				}
				return data;
			}
		}
		return null;
	}

	/**
	 * 选中节点
	 * @param nodekey id
	 * @param clikckNode 是否要触发click
	 */
	onSetNodeSelected(nodekey: string, clikckNode: boolean = true) {
		// 1、首先赋值
		this.setNodeSelected_OnClick = clikckNode;
		this._willSelectedNodeKey = nodekey;
		// 2、设置选中
		this._setNodeSelected(nodekey);
	}

	/**
	 * 重新命名
	 * @param nodekey
	 * @param newName
	 */
	onRename(nodekey: string, newName: string) {
		const node = this.mapNode.get(nodekey);
		if (node && this.flowchartDiagram) {
			// 2、设置选中
			node.label = newName;
			// let obj = this.flowchartDiagram.findNodeForKey(nodekey);
			// this.flowchartDiagram.(obj);
			this._refresDiagram();
			this.flowchartHander.handlerSaveNodeName(newName);
		}
	}

	/**
	 * 得到节点
	 * @param nodekey
	 * @param newName
	 */
	onGetNode(nodekey: string): INodeModel | undefined {
		const data = this.mapNode.get(nodekey);
		if (data) {
			return data;
		}
		return undefined;
	}

	/**
	 * 得到节点的子节点
	 * @param nodekey
	 * @param newName
	 */
	onGetNodeChildKeys(nodekey: string): string[] {
		const data = this.mapNodeChildKeys.get(nodekey);
		const currNodeType = this.mapNodeType.get(nodekey);
		if (
			(currNodeType === NodeEnum.Loop || currNodeType === NodeEnum.Branch || nodekey === 'root') &&
			data &&
			data.length > 1
		) {
			return data.slice(1, data.length - 1);
		}
		return data || [];
	}

	/**
	 * 得到节点兄弟节点
	 * @param nodekey
	 * @param newName
	 */
	onGetNodeBrotherKeys(nodekey: string): string[] {
		const data = this.mapNodeBrotherKeys.get(nodekey);
		if (data) {
			return data;
		}
		return [];
	}

	/**
	 * 得到某一类型的全部节点
	 * @param nodekey
	 * @param newName
	 */
	onGetNodeByType(nodekey: string): string[] {
		const data = this.mapNodeTypeKeys.get(nodekey);
		if (data && data.size > 0) {
			return [...data];
		}
		return [];
	}

	/**
	 *
	 * @param nodekey
	 */
	onGetNodeNavigateKey(nodekey: string): string {
		const data = this.mapNodeNativeKey.get(nodekey);
		if (data) {
			return data;
		}
		return '';
	}

	onGetAll(): FlowchartModel {
		const res = this.getData();
		return res;
	}

	get canCopy(): boolean {
		if (this._willCopyNodeId && this._willCopyNodeId.length > 2) {
			return true;
		}
		return false;
	}

	get canCut(): boolean {
		if (this._willCutNodeId && this._willCutNodeId.length > 2) {
			return true;
		}
		return false;
	}

	// @action
	private _refresDiagram() {
		const data = this.getDiagram();
		this.nodeDataArray = [...data.nodeArray];
		this.linkDataArray = [...data.linkArray];
		this.flowchartHander.handlerChanged();
	}

	private _setNodeSelected(key: string) {
		if (this.flowchartDiagram && key) {
			const obj = this.flowchartDiagram.findNodeForKey(key);
			if (obj) {
				this.flowchartDiagram.clearSelection();
				this.flowchartDiagram.select(obj);
				this._willSelectedNodeKey = '';
			}
		}
	}

	private get _getPostion(): { x: number; y: number } {
		if (this.flowchartDiagram) {
			const offset = this.flowchartDiagram.lastInput.viewPoint;
			return {
				x: offset.x,
				y: offset.y
			};
		}
		return {
			x: 0,
			y: 0
		};
	}
}
