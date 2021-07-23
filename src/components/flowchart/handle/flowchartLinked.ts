/* eslint-disable camelcase */
/* eslint-disable accessor-pairs */
/* eslint-disable complexity */
import go from '@octopus/gojs';
import { observable } from 'mobx';
import { IDiagramHander, IFlowchartHander, IDiagramModel, INodeModel, ILineModel, INodeEvent } from '../interface';
import BaseChanges from '../draw/baseChanges';
import { HandleEnum, NodeEnum } from '../enum';
import { NodeStore, LineStore } from '../store';
import { FlowchartModel } from '../model';
import flowchartStore from './flowchartStore';

declare const window: Window & { gojsCopyNodelinked: INodeModel | null };

/**
 *
 */
interface IWaiteEvent {
	/** 监听的事件类型 */
	eType: 'setSelected' | 'setSelectedTriggerClick';
	/** 当前点 */
	nodeKey: string;
}

export default class HanderFlowchart extends flowchartStore implements IDiagramHander {
	/** 调用 对外的暴露的接口方法 */
	flowchartHander: IFlowchartHander;
	flowchartDiagram: go.Diagram | null = null;

	/**
	 * 是否已经显示了节点/线的菜单弹窗/其他弹窗,
	 * 默认是没有显示
	 * 现在是当你去得到点/线的坐标时候。就认为你打开的弹窗
	 */
	private _showFlowchartPopups: boolean = false;

	/**
	 * 上一次操作的节点ID
	 */
	private _preActiveNodeKey: string = '';

	/**
	 * 在 Diagram LayoutCompleted 后要触发的事件，
	 * 存在这种情况，外部希望触发一个节点（但是该节点可能还没绘制出来），那我们先存储要希望的操作，等LayoutCompleted后再执行
	 */
	private _afterRenderEvent: IWaiteEvent | null = null;

	/**
	 * 要剪切的节点
	 */
	private _willCutNodeId = '';

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
	 *
	 * 重要说明
	 * 根据业务需求
	 * 因为 ChangedSelection 必然要改变节点的选中状态，且必须触发一次选中，
	 * 所以 ObjectSingleClicked 就不触发选中事件，不然会引起重复触发点击
	 */
	public handleDiagramEvent(e: go.DiagramEvent) {
		const { name } = e;
		switch (name) {
			case 'ChangedSelection':
				// 都会执行的方法 ObjectSingleClicked、ObjectContextClicked、BackgroundSingleClicked
				this._hideContextMenu();
				this._setNodeBlur(this._preActiveNodeKey);
				const firstNode = e.subject.first();
				if (
					firstNode &&
					firstNode.part &&
					firstNode.data &&
					(firstNode.part instanceof go.Node || firstNode.part instanceof go.Group)
				) {
					const changedNode = firstNode.data;
					if (changedNode) {
						if (this._preActiveNodeKey !== changedNode.key) {
							// 清除上一个节点的 Spot样式
							this._preActiveNodeKey = changedNode.key;
						}
						// 同步当前节点的 Spot样式
						this._setNodeFocus(changedNode.key);

						// 如果只设置选中 且 只是选中不触发click回调函数
						if (this._afterRenderEvent && this._afterRenderEvent.eType === 'setSelected') {
							return;
						}
						this.flowchartHander.handlerClickNode(changedNode);
					} else {
						/**
						 * 当出现不符合条件的节点时候，走这里。
						 * 目前基本触发不到
						 */
						this.flowchartHander.handlerClickExcludeNode();
					}
				}
				break;
			case 'ObjectSingleClicked': // 默认会先触发 ChangedSelection
				if (
					e.subject &&
					e.subject.part &&
					(e.subject.part instanceof go.Node || e.subject.part instanceof go.Group)
				) {
					const clickNode = e.subject.part.data;
					if (clickNode && clickNode.key && this._preActiveNodeKey === clickNode.key) {
						this.flowchartHander.handlerClickNodeAgain(clickNode);
					}
					this._preActiveNodeKey = clickNode.key;
				}
				break; 
			case 'ObjectContextClicked': // 默认会先触发 ChangedSelection
				if (
					e.subject &&
					e.subject.part &&
					(e.subject.part instanceof go.Node || e.subject.part instanceof go.Group)
				) {
					const contextNode = e.subject.part.data;
					if (contextNode) {
						const { x } = this._getPostion();
						const { y } = this._getNodeDocumentOffset(contextNode);
						this.flowchartHander.handlerRightClickNode(contextNode, x, y);
					}
				}
				break;
			case 'BackgroundSingleClicked': // 默认会先触发 ChangedSelection
				this.flowchartHander.handlerClickBackground();
				break;
			case 'ViewportBoundsChanged':
				this.flowchartHander.handlerViewChanged();
				break;
			case 'LostFocus':
				this.flowchartHander.handlerLostFocus();
				break;
			default:
				break;
		}
	}

	/**
	 * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
	 * This method iterates over those changes and updates state to keep in sync with the GoJS model.
	 * @param obj a JSON-formatted string
	 */
	public handleModelChange(obj: go.IncrementalData) {
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
			/** 流程图重新渲染后事件 */
			case HandleEnum.ReRender:
				if (this._afterRenderEvent && this._afterRenderEvent.nodeKey) {
					switch (this._afterRenderEvent.eType) {
						case 'setSelected':
							this._setNodeSelected(this._afterRenderEvent.nodeKey, false);
							break;
						case 'setSelectedTriggerClick':
							this._setNodeSelected(this._afterRenderEvent.nodeKey, true);
							break;
					}
				}
				// 清空事件
				this._afterRenderEvent = null;
				break;
			/** 打开点菜单 */
			case HandleEnum.ShowNodeMenu:
				this.flowchartHander.handlerBeforeShowLineMenu();
				pos = this._getNodeDocumentOffset(node);
				this.flowchartHander.handlerShowNodeMenu(node, pos.x, pos.y);
				break;
			case HandleEnum.ShowNodeInfo:
				pos = this._getNodeDocumentOffset(node);
				this.flowchartHander.handlerShowNodeInfo(node, pos.x, pos.y);
				break;
			case HandleEnum.ShowLineMenu:
				this.flowchartHander.handlerBeforeShowLineMenu();
				pos = this._getLIneDocumentOffset(line);
				this.flowchartHander.handlerShowLineMenu(line, pos.x, pos.y);
				break;
			case HandleEnum.MouseEnter:
				this.flowchartHander.handlerMouseEnter(node);
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
				this.flowchartHander.handlerAddNode(resNode);
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
				this.flowchartHander.handlerAddNode(resNode);
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
				this.flowchartHander.handlerAddNode(resNode);
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
				this.flowchartHander.handlerAddNode(resNode);
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
				this.flowchartHander.handlerAddNode(resNode);
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
		this.getNodeLinked(nodekey);
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
		window.gojsCopyNodelinked = null;
		return true;
	}

	/**
	 * 黏贴到节点
	 * @param toNodekey 要黏贴到的nodeId
	 */
	onPaste2Node(toNodekey: string) {
		const resNodekey = this.copyNodeLinked2Node(toNodekey);
		if (resNodekey) {
			this._refresDiagram();
			// 自身再复制一次，准备下一次被复制，必须在 _refresDiagram 后执行
			this.getNodeLinked(resNodekey);
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

	/**
	 * 显示、隐藏详情按钮
	 * @param key
	 */
	onSetNodeListActionVisible(key: string, show: boolean = false) {
		if (this.flowchartDiagram && key) {
			const node = this.flowchartDiagram.findNodeForKey(key);
			if (node) {
				BaseChanges.setListCss(node, show);
			}
		}
	}

	private _hideContextMenu() {
		if (this.flowchartDiagram && this._showFlowchartPopups) {
			this.flowchartHander.handlerHideModal();
			this._showFlowchartPopups = false;
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
	onGetNodeData(nodekey: string) {
		if (nodekey) {
			const data = this.cacheNodeData.get(nodekey);
			if (data && Object.keys(data).length > 0) {
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
		if (this.flowchartDiagram && nodekey) {
			const obj = this.flowchartDiagram.findNodeForKey(nodekey);
			// 1 如果直接存在这个节点
			if (obj) {
				// 1.1、设置选中 对已经存在的节点可以直接起作用
				this._setNodeSelected(nodekey, clikckNode);
			} else {
				/**
				 * 2、如果不存在这个节点，则交给流程图渲染后处理
				 * 这里有点难理解
				 * 会在 handFlowchartEvent 方法 case HandleEnum.ReRender的分支条件下触发
				 * 利用 Diagram 渲染完成触发 LayoutCompleted 事件，后执行。
				 */
				this._afterRenderEvent = {
					eType: clikckNode ? 'setSelectedTriggerClick' : 'setSelected',
					nodeKey: nodekey
				};
			}
		}
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
			this.flowchartHander.handlerSaveNodeName(nodekey, newName);
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
		if (nodekey === NodeEnum.ExtractData) {
			return this.cacheExateData;
		}
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

	/**
	 * 得到节点被包裹的第一层循环
	 * @param nodekey
	 */
	onGetNodeFirstLoopKey(nodekey: string): string {
		const data = this.mapNode.get(nodekey);
		if (data && data.group) {
			let preData = this.mapNode.get(data.group);
			while (preData) {
				if (preData.type === NodeEnum.Loop) {
					return preData.key;
				}
				preData = this.mapNode.get(preData.group);
			}
		}
		return '';
	}

	/**
	 * 得到所有数据
	 */
	onGetAll(): FlowchartModel {
		const res = this.getData();
		return res;
	}

	/**
	 * 得到node 右上角（top right）的坐标
	 * @param nodekey
	 */
	onGetNodeDocumentOffsetForMenu(nodekey: string): { x: number; y: number } {
		const data = this.mapNode.get(nodekey);
		return this._getNodeDocumentOffset(data);
	}
	/**
	 * 得到line 右上角(top right)的坐标
	 * @param nodekey
	 */
	onGetLineDocumentOffsetForMenu(line: ILineModel): { x: number; y: number } {
		return this._getLIneDocumentOffset(line);
	}

	/**
	 * 得到节点 左上角在 document的坐标
	 * @param nodekey
	 */
	onGetNodeDocumentOffset(nodekey: string): { x: number; y: number } {
		const node = this.mapNode.get(nodekey);
		if (this.flowchartDiagram && node) {
			const currentNode = this.flowchartDiagram.findNodeForKey(node.key);
			if (currentNode) {
				const pos = this.flowchartDiagram.transformDocToView(currentNode.getDocumentPoint(go.Spot.TopLeft));
				// 如果是分支，x偏移5px
				return {
					x: pos.x,
					y: pos.y
				};
			}
		}
		return {
			x: -10000,
			y: -10000
		};
	}

	/**
	 * 显示node在中央
	 * 为了优化
	 * @param _centerKey
	 */
	onNodeCeterRect = (_centerKey: string) => {
		if (this.flowchartDiagram) {
			if (_centerKey) {
				const _currentNode = this.flowchartDiagram.findNodeForKey(_centerKey);
				if (_currentNode) {
					this.flowchartDiagram.centerRect(_currentNode.actualBounds);
				}
			}
		}
	};

	/**
	 * 判断是否能复制
	 */
	get canCopy(): boolean {
		if (window.gojsCopyNodelinked) {
			return true;
		}
		return false;
	}

	/**
	 * 判断是否能剪切
	 */
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

	private _setNodeSelected(key: string, triggerClikckEvent: boolean) {
		if (this.flowchartDiagram && key) {
			const obj = this.flowchartDiagram.findNodeForKey(key);
			if (obj) {
				this.flowchartDiagram.clearSelection();

				// 如果要触发点击事件
				this.flowchartDiagram.select(obj);

				// 修正节点
				if (this._preActiveNodeKey !== key) {
					this._preActiveNodeKey = key;
				}
			}
		}
	}

	/**
	 *  只所以要这个方法，是因为失焦时候要对 spot 样式同步修改（比如：菜单）
	 * @param key
	 */
	private _setNodeBlur(key: string) {
		if (this.flowchartDiagram && key) {
			const objPre = this.flowchartDiagram.findNodeForKey(key);
			if (objPre) {
				BaseChanges.setListCss(objPre, false);
				BaseChanges.setActionCss(objPre, false);
			}
		}
	}

	/**
	 *  之所以要这个方法，是因为选中时候要对 spot 样式同步修改（比如：菜单）
	 * @param key
	 */
	private _setNodeFocus(key: string) {
		if (this.flowchartDiagram && key) {
			const objPre = this.flowchartDiagram.findNodeForKey(key);
			if (objPre) {
				// 多余的渲染。暂留
				// BaseChanges.setNodeCss(objPre, true);
				// BaseChanges.setGroupCss(objPre, true);
				// BaseChanges.setListCss(objPre, true);
				BaseChanges.setActionCss(objPre, true);
			}
		}
	}

	/**
	 * 得到当前点击的docment坐标
	 */
	private _getPostion(): { x: number; y: number } {
		// 默认打开的弹窗
		this._showFlowchartPopups = true;
		if (this.flowchartDiagram) {
			const offset = this.flowchartDiagram.lastInput.viewPoint;
			return {
				x: offset.x,
				y: offset.y
			};
		}
		return {
			x: -10000,
			y: -10000
		};
	}

	/**
	 *  得到node在docment的坐标
	 * @param node
	 */
	private _getNodeDocumentOffset(node: INodeModel | undefined): { x: number; y: number } {
		if (this.flowchartDiagram && node) {
			// 默认打开的弹窗
			this._showFlowchartPopups = true;
			const currentNode = this.flowchartDiagram.findNodeForKey(node.key);

			if (currentNode) {
				const pos = this.flowchartDiagram.transformDocToView(currentNode.getDocumentPoint(go.Spot.TopRight));
				// 如果是分支，x偏移5px
				return {
					x: pos.x - (node.type === NodeEnum.Branch ? 22 : 12),
					y: pos.y + 32
				};
			}
		}
		return {
			x: -10000,
			y: -10000
		};
	}

	/**
	 *  得到node在docment的坐标
	 * @param node
	 */
	private _getLIneDocumentOffset(line: ILineModel | undefined): { x: number; y: number } {
		if (this.flowchartDiagram && line) {
			// 默认打开的弹窗
			this._showFlowchartPopups = true;
			const currentNode = this.flowchartDiagram.findLinkForData(line);
			if (currentNode) {
				const pos = this.flowchartDiagram.transformDocToView(currentNode.getDocumentPoint(go.Spot.TopRight));
				// 如果是分支，x偏移5px
				return {
					x: pos.x - 85,
					y: pos.y + 20
				};
			}
		}
		return {
			x: -10000,
			y: -10000
		};
	}
}
