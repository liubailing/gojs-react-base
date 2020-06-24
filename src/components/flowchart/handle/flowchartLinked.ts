import go from 'gojs';
import { observable, action, toJS } from 'mobx';
import FlowchartData from './flowchartData';
import { IDiagramHander, IFlowchartHander, DiagramModel, NodeModel, LineModel, NodeEvent } from '../interface';
import { HandleEnum, NodeEnum } from '../enum';
import { NodeStore, LineStore } from '../controller';

export default class HanderFlowchart extends FlowchartData implements IDiagramHander {
	/**调用 对外的暴露的接口方法 */
	flowchartHander: IFlowchartHander;
	private flowchartDiagram: go.Diagram | null = null;
	constructor(handles: IFlowchartHander) {
		super();
		this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handFlowchartEvent = this.handFlowchartEvent.bind(this);
		this.flowchartHander = handles;
	}

	data: DiagramModel<NodeModel, LineModel> | null = null;

	@observable nodeDataArray: Array<NodeModel> = [];
	@observable linkDataArray: Array<LineModel> = [];
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
						const idx = this.mapNodeKeyIdx.get(sel.key as string);
						if (idx !== undefined && idx >= 0) {
							this.flowchartHander.handlerClickNode(this.nodeDataArray[idx]);
						}
					} else if (sel instanceof go.Group) {
						const idx = this.mapLineKeyIdx.get(sel.key as string);
						if (idx !== undefined && idx >= 0) {
							this.flowchartHander.handlerClickNode(this.nodeDataArray[idx]);
						}
					}
				} else {
					// draft.selectedData = null;
				}
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
		// const insertedNodeKeys = obj.insertedNodeKeys;
		// const modifiedNodeData = obj.modifiedNodeData;
		// const removedNodeKeys = obj.removedNodeKeys;
		// const insertedLinkKeys = obj.insertedLinkKeys;
		// const modifiedLinkData = obj.modifiedLinkData;
		// const removedLinkKeys = obj.removedLinkKeys;
		// const modifiedModelData = obj.modelData;
		// // maintain maps of modified data so insertions don't need slow lookups
		// const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
		// const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
		//
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
	initFlochart(nodeDataArray: Array<NodeModel>, linkDataArray: Array<LineModel>) {
		// const data = TestData.getFlowchartData(istrue);
		this.nodeDataArray = nodeDataArray;
		this.linkDataArray = linkDataArray;
		this.selectedData = this.nodeDataArray.filter((x) => x.label == '提取数据');
		super.refresData(toJS(this.nodeDataArray), toJS(this.linkDataArray));
	}

	/**
	 * 监听到流程图操作
	 */
	handFlowchartEvent(e: NodeEvent) {
		let node: NodeModel = e.node ? e.node : NodeStore.baseModel;
		let line: LineModel = e.line ? e.line : LineStore.getLink('', '', '');
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
				let res = this.addBranch2Pre(node.key);
				this._refresDiagram();

				break;
			case HandleEnum.AddBranchToRight:
				this.addBranch2Next(node.key);
				this._refresDiagram();
				break;
			case HandleEnum.DragNode2Link:
				this.dragNode2link(node.key, e.toLine);
				this._refresDiagram();

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
	onAdd2After8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2After8NodeId(nodeId, type);
		this._refresDiagram();
		return res;
	}

	/**
	 * 往内部 新增节点，依据nodeid
	 * @param nodekey  要添加的节点Id。
	 * @param type 添加的节点类型, 必须是 nodeId属于 条件，循环，分支
	 */
	onAdd2Inner8NodeId(nodeId: string, type: NodeEnum): boolean {
		let res = this.add2Inner8NodeId(nodeId, type);
		this._refresDiagram();
		return res;
	}

	onDeleteNode(nodekey: string) {}

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

	@action
	_refresDiagram() {
		// this.nodeDataArray = [];
		// this.linkDataArray = [];
		this.nodeDataArray = [...this.getNodes(), ...[]];
		this.linkDataArray = [...this.getLines(), ...[]];
		console.log(`数据：nodes-${this.nodeDataArray.length},lines:${this.linkDataArray.length}`);
	}

	getAll() {
		this.nodeDataArray = [...this.getNodes(), ...[]];
		this.linkDataArray = [...this.getLines(), ...[]];
		return {
			nodes: this.nodeDataArray,
			lines: this.linkDataArray
		};
	}
}
