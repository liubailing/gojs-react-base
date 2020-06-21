import go from 'gojs';
import { observable, computed, action } from 'mobx';
import FlowchartData from './flowchartData';
import { IDiagramHander, IFlowchartHander, DiagramModel, NodeModel, LineModel, NodeEvent } from '../interface';
import { TestData } from '../workflow';
import { HandleEnum } from '../enum';
import { FCNode, FCLink } from '../controller';

export default class HanderFlowchart extends FlowchartData implements IDiagramHander {
	/**调用 对外的暴露的接口方法 */
	flowchartHander: IFlowchartHander;
	private flowchartDiagram: go.Diagram | null = null;
	constructor(handles: IFlowchartHander) {
		super();
		this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handFlowchartEvent = this.handFlowchartEvent.bind(this);

		this.initFlochart();
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
						const idx = this.mapNodeKeyIdx.get(sel.key);
						if (idx !== undefined && idx >= 0) {
							this.flowchartHander.handlerClickNode(this.nodeDataArray[idx]);
						}
					} else if (sel instanceof go.Group) {
						const idx = this.mapLinkKeyIdx.get(sel.key);
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
		const insertedNodeKeys = obj.insertedNodeKeys;
		const modifiedNodeData = obj.modifiedNodeData;
		const removedNodeKeys = obj.removedNodeKeys;
		const insertedLinkKeys = obj.insertedLinkKeys;
		const modifiedLinkData = obj.modifiedLinkData;
		const removedLinkKeys = obj.removedLinkKeys;
		const modifiedModelData = obj.modelData;

		// maintain maps of modified data so insertions don't need slow lookups
		const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
		const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
		// debugger;
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
		const target = e.target;
		const value = target.checked;
		// this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
	}

	istrue: boolean = true;
	test(action: string) {
		switch (action) {
			case 'init':
				this.istrue = !this.istrue;
				this.initFlochart(this.istrue);
				break;
			case 'hide_contextMenu':
				this.istrue = !this.istrue;
				this._hideContextMenu();
				break;

			default:
				break;
		}
	}

	@action
	initFlochart(istrue?: boolean) {
		const data = TestData.getFlowchartData(istrue);
		this.nodeDataArray = data.nodeArray;
		this.linkDataArray = data.linkArray;
		this.selectedData = this.nodeDataArray.filter((x) => x.label == '提取数据');
		super.initData();
	}

	/**
	 * 监听到流程图操作
	 */
	handFlowchartEvent(e: NodeEvent) {
		let node: NodeModel = e.node ? e.node : FCNode.baseModel;
		let line: LineModel = e.line ? e.line : FCLink.getLink('', '', '');
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
				debugger;
				break;
			case HandleEnum.AddBranchToRight:
				break;
			default:
				break;
		}
		// console.log(`---------,`, e);
	}

	getDiagram = (d: go.Diagram) => {
		if (d) {
			this.flowchartDiagram = d;
		}
	};
	onAppendNodeToNode() {}
	onDeleteNodeToNode() {}

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

	private _hideContextMenu() {
		if (this.flowchartDiagram) {
			// this.flowchartDiagram.commandHandler.showContextMenu();
			this.flowchartDiagram.commandHandler.doKeyDown();
			this.flowchartHander.handlerHideContextMenu();
			this.flowchartDiagram.commandHandler.doKeyDown();
		}
	}
}
