/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as go from 'gojs';
import * as React from 'react';

import Diagram from './diagram';
import { HanderFlowchart } from './handle';
import './flowchartDiagram.css';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export interface FlowchartProps {
	flowchart: HanderFlowchart;
}

class FlowchartDiagram extends React.Component<FlowchartProps> {
	// Maps to store key -> arr index for quick lookups
	// private mapNodeKeyIdx: Map<go.Key, number>;
	// private mapLinkKeyIdx: Map<go.Key, number>;

	constructor(props: FlowchartProps) {
		super(props);
		// init maps
		// this.mapNodeKeyIdx = new Map<go.Key, number>();
		// this.mapLinkKeyIdx = new Map<go.Key, number>();
		this.init();
		//
		this.refreshNodeIndex(this.props.flowchart.nodeDataArray);
		this.refreshLinkIndex(this.props.flowchart.linkDataArray);
		// bind handler methods
		this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleRelinkChange = this.handleRelinkChange.bind(this);
	}

	init() {
		this.state = {
			nodeDataArray: this.props.flowchart.nodeDataArray,
			linkDataArray: this.props.flowchart.linkDataArray,
			modelData: {
				canRelink: true
			},
			selectedData: this.props.flowchart.selectedData,
			skipsDiagramUpdate: false
		};
	}

	/**
	 * Update map of node keys to their index in the array.
	 */
	private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
		// this.mapNodeKeyIdx.clear();
		// nodeArr.forEach((n: go.ObjectData, idx: number) => {
		// 	this.mapNodeKeyIdx.set(n.key, idx);
		// });
	}

	/**
	 * Update map of link keys to their index in the array.
	 */
	private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
		// this.mapLinkKeyIdx.clear();
		// linkArr.forEach((l: go.ObjectData, idx: number) => {
		// 	this.mapLinkKeyIdx.set(l.key, idx);
		// });
	}

	/**
	 * Handle any relevant DiagramEvents, in this case just selection changes.
	 * On ChangedSelection, find the corresponding data and set the selectedData state.
	 * @param e a GoJS DiagramEvent
	 */
	public handleDiagramEvent(e: go.DiagramEvent) {
		const name = e.name;
		// switch (name) {
		// 	case 'ChangedSelection': {
		// 		const sel = e.subject.first();
		// 		this.setState(
		// 			produce((draft: FlowchartState) => {
		// 				if (sel) {
		// 					if (sel instanceof go.Node) {
		// 						const idx = this.mapNodeKeyIdx.get(sel.key);
		// 						if (idx !== undefined && idx >= 0) {
		// 							const nd = draft.nodeDataArray[idx];
		// 							draft.selectedData = nd;
		// 						}
		// 					} else if (sel instanceof go.Link) {
		// 						const idx = this.mapLinkKeyIdx.get(sel.key);
		// 						if (idx !== undefined && idx >= 0) {
		// 							const ld = draft.linkDataArray[idx];
		// 							draft.selectedData = ld;
		// 						}
		// 					}
		// 				} else {
		// 					draft.selectedData = null;
		// 				}
		// 			})
		// 		);
		// 		break;
		// 	}
		// 	default:
		// 		break;
		// }
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
		const target = e.target;
		const value = target.checked;
		this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
	}

	public render() {
		// const selectedData = this.state.selectedData;
		let domId = 'divFlowchart';
		return (
			<div className={'div-flowchart'}>
				<div id={domId} className={'div-flowchart-diagram'}></div>
				<Diagram
					diagramId={domId}
					nodeDataArray={this.props.flowchart.nodeDataArray}
					linkDataArray={this.props.flowchart.linkDataArray}
					modelData={this.props.flowchart.modelData}
					skipsDiagramUpdate={this.props.flowchart.skipsDiagramUpdate}
					onDiagramEvent={this.handleDiagramEvent}
					onModelChange={this.handleModelChange}
				/>
			</div>
		);
	}
}

export default FlowchartDiagram;
