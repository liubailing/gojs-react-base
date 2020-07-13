import go from 'gojs';
import { observable, action } from 'mobx';
import flowchartStore from './flowchartStore';
import { IDiagramHander, IFlowchartHander, IDiagramModel, INodeModel, ILineModel, INodeEvent } from '../interface';
import { HandleEnum, NodeEnum } from '../enum';
import { NodeStore, LineStore } from '../store';
import { FlowchartModel } from '../model';

export default class HanderFlowchart extends flowchartStore implements IDiagramHander {
	/**调用 对外的暴露的接口方法 */
	flowchartHander: IFlowchartHander;
	private flowchartDiagram: go.Diagram | null = null;

	/**
	 * 缓存 nodeKey - 缓存的数据
	 */
	private mapNodeData: Map<string, object>;

	/**设置选中节点后并触发 click,
	 * 为false的时候不触发click
	 *  */
	private setNodeSelected_OnClick = true;
	constructor(handles: IFlowchartHander) {
		super();
		this.mapNodeData = new Map<string, object>();
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
		const name = e.name;
		console.log('handleDiagramEvent.', name);
		switch (name) {
			case 'ChangedSelection': {
				const sel = e.subject.first();
				if (sel) {
					if (sel instanceof go.Node) {
						const node = this.mapNode.get(sel.key as string);
						if (node && this.setNodeSelected_OnClick) {
							this.flowchartHander.handlerClickNode(node);
						}
					} else if (sel instanceof go.Group) {
						const node = this.mapNode.get(sel.key as string);
						if (node && this.setNodeSelected_OnClick) {
							this.flowchartHander.handlerClickNode(node);
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
				break;
		}
	}

	/**
	 * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
	 * This method iterates over those changes and updates state to keep in sync with the GoJS model.
	 * @param obj a JSON-formatted string
	 */
	public handleModelChange(obj: go.IncrementalData) {
		// console.log(`chenged model`);
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

	@action
	initFlochart(fcdata: FlowchartModel) {
		// this.selectedData = this.nodeDataArray.filter((x) => x.label == '提取数据');
		super.refresData(fcdata);
		this._refresDiagram();
	}

	/**
	 * 监听到流程图操作
	 */
	handFlowchartEvent(e: INodeEvent) {
		let node: INodeModel = e.node ? e.node : NodeStore.baseModel;
		let line: ILineModel = e.line ? e.line : LineStore.getLink('', '', '');
		let pos;
		switch (e.eType) {
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
					this.onDragNode2Node(node.key, e.toLine?.from);
				}
				break;
			default:
				break;
		}
		// console.log(`---------,`, e);
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
	onAdd2Next8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2Next8NodeId(nodeId, type);
		if (res) {
			this._refresDiagram();
		}
		return res;
	}

	/**
	 * 往后新增节点，依据nodeId
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型
	 */
	onAdd2Pre8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2Pre8NodeId(nodeId, type);
		if (res) {
			this._refresDiagram();
		}
		return res;
	}

	/**
	 * 往内部 新增节点，依据nodeid
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型, 必须是 nodeId属于 条件，循环，分支
	 */
	onAdd2InnerTail8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2InnerTail8NodeId(nodeId, type);
		this._refresDiagram();
		return res;
		// return false;
	}

	/**
	 * 往内部的头部 新增节点，依据nodeid
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型, 必须是 nodeId属于 条件，循环，分支
	 */
	onAdd2InnerHeader8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2InnerHeader8NodeId(nodeId, type);
		this._refresDiagram();
		return res;
		// return false;
	}

	/**
	 * 移除
	 * @param nodekey
	 */
	onRemoveNode(nodekey: string) {
		let res = this.remove8NodeId(nodekey);
		if (res) {
			this._refresDiagram();
			// 删除节点缓存数据
			this.mapNodeData.delete(nodekey);
		}
		return res;
	}

	/**
	 * 拖拽
	 * @param nodekey
	 * @param toNodekey
	 */
	onDragNode2Node(nodekey: string, toNodekey: string) {
		let res = this.removeNode2Node(nodekey, toNodekey);
		if (res) {
			this._refresDiagram();
		}
		return res;
	}

	/**
	 * 复制
	 * @param nodekey
	 * @param toNodekey
	 */
	onCopyNode2Node(nodekey: string, toNodekey: string) {
		let res = this.copyNode2Node(nodekey, toNodekey);
		if (res) {
			this._refresDiagram();
		}
		return res;
	}

	private get _getPostion(): { x: number; y: number } {
		if (this.flowchartDiagram) {
			let offset = this.flowchartDiagram.lastInput.viewPoint;
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

	_hideContextMenu() {
		if (this.flowchartDiagram) {
			// this.flowchartDiagram.commandHandler.showContextMenu();
			this.flowchartDiagram.commandHandler.doKeyDown();
			this.flowchartHander.handlerHideContextMenu();
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
			this.mapNodeData.set(nodekey, data);
		}
	}

	/**
	 * 取得节点配置数据
	 * @param nodekey
	 * @param data
	 */
	onGetNodeData(nodekey: string): object | null {
		if (nodekey) {
			let data = this.mapNodeData.get(nodekey);
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
		if (this.flowchartDiagram) {
			// 1、首先赋值
			this.setNodeSelected_OnClick = clikckNode;
			// 2、设置选中
			this.flowchartDiagram.clearSelection();
			let obj = this.flowchartDiagram.findNodeForKey(nodekey);
			this.flowchartDiagram.select(obj);
		}
	}

	/**
	 * 重新命名
	 * @param nodekey
	 * @param newName
	 */
	@action
	onRename(nodekey: string, newName: string) {
		let node = this.mapNode.get(nodekey);
		if (node && this.flowchartDiagram) {
			// 2、设置选中
			node.label = newName;
			// let obj = this.flowchartDiagram.findNodeForKey(nodekey);
			// this.flowchartDiagram.(obj);
			this._refresDiagram();
		}
	}

	/**
	 * 重新命名
	 * @param nodekey
	 * @param newName
	 */
	@action
	onGetNode(nodekey: string): INodeModel | undefined {
		let data = this.mapNode.get(nodekey);
		if (data) {
			return data;
		}
		return undefined;
	}

	@action
	_refresDiagram() {
		let data = this.getDiagram();
		this.nodeDataArray = [...data.nodeArray, ...[]];
		this.linkDataArray = [...data.linkArray, ...[]];
	}

	getAll() {
		return {
			nodes: this.nodeDataArray,
			lines: this.linkDataArray
		};
	}
}
