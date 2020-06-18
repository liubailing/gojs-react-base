import go from 'gojs';
import { observable, computed, action } from 'mobx';

import { IDiagramHander, IFlowchartHander, DiagramModel, NodeModel, LinkModel } from '../interface';
import { TestData } from '../workflow';

export default class HanderFlowchart implements IDiagramHander {
	flowchartHander: IFlowchartHander;
	constructor(handles: IFlowchartHander) {
		this.initFlochart();
		this.flowchartHander = handles;
	}

	data: DiagramModel<NodeModel, LinkModel> | null = null;

	@observable nodeDataArray: Array<go.ObjectData> = [];
	@observable linkDataArray: Array<go.ObjectData> = [];
	@observable modelData: go.ObjectData = {};
	@observable selectedData: go.ObjectData | null = null;
	@observable skipsDiagramUpdate: boolean = false;

	/**
	 * Update map of node keys to their index in the array.
	 */
	refreshNodeIndex(nodeArr: Array<go.ObjectData>) {}

	/**
	 * Update map of link keys to their index in the array.
	 */
	refreshLinkIndex(linkArr: Array<go.ObjectData>) {}

	/**
	 * Handle any relevant DiagramEvents, in this case just selection changes.
	 * On ChangedSelection, find the corresponding data and set the selectedData state.
	 * @param e a GoJS DiagramEvent
	 */
	public handleDiagramEvent(e: go.DiagramEvent) {}

	/**
	 * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
	 * This method iterates over those changes and updates state to keep in sync with the GoJS model.
	 * @param obj a JSON-formatted string
	 */
	public handleModelChange(obj: go.IncrementalData) {}

	/**
	 * Handle inspector changes, and on input field blurs, update node/link data state.
	 * @param path the path to the property being modified
	 * @param value the new value of that property
	 * @param isBlur whether the input event was a blur, indicating the edit is complete
	 */
	public handleInputChange(path: string, value: string, isBlur: boolean) {}

	initFlochart(istrue?: boolean) {
		debugger;
		const data = TestData.getFlowchartData(istrue);
		this.nodeDataArray = data.nodeArray;
		this.linkDataArray = data.linkArray;
		this.selectedData = this.nodeDataArray.filter((x) => x.label == '提取数据');
	}

	onAppendNodeToNode() {}
	onDeleteNodeToNode() {}
}
