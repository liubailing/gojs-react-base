/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as go from 'gojs';
import * as React from 'react';
import { observer } from 'mobx-react';
import Diagram from './diagram';
import { HanderFlowchart } from './handle';
import { NodeEvent } from './interface';
import './flowchartDiagram.css';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export interface FlowchartProps {
	taskId: string;
	flowchart: HanderFlowchart;
}

@observer
class FlowchartDiagram extends React.Component<FlowchartProps> {
	// Maps to store key -> arr index for quick lookups

	constructor(props: FlowchartProps) {
		super(props);
		// init maps

		this.init();
		//
		// this.refreshNodeIndex(this.props.flowchart.nodeDataArray);
		// this.refreshLinkIndex(this.props.flowchart.linkDataArray);
		// bind handler methods
		// this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
		// this.handleModelChange = this.handleModelChange.bind(this);
		// this.handleInputChange = this.handleInputChange.bind(this);
		// this.handleRelinkChange = this.handleRelinkChange.bind(this);
	}

	init() {}

	// /**
	//  * Handle any relevant DiagramEvents, in this case just selection changes.
	//  * On ChangedSelection, find the corresponding data and set the selectedData state.
	//  * @param e a GoJS DiagramEvent
	//  */
	// public handleDiagramEvent(e: go.DiagramEvent) {
	// 	this.props.flowchart.handleDiagramEvent(e);
	// }

	// /**
	//  * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
	//  * This method iterates over those changes and updates state to keep in sync with the GoJS model.
	//  * @param obj a JSON-formatted string
	//  */
	// public handleModelChange(obj: go.IncrementalData) {
	// 	this.props.flowchart.handleModelChange(obj);
	// }

	public render() {
		// const selectedData = this.state.selectedData;
		let domId = 'divFlowchart' + this.props.taskId;
		return (
			<div className={'div-flowchart'}>
				<div id={domId} className={'div-flowchart-diagram'}></div>
				<Diagram
					diagramId={domId}
					nodeDataArray={this.props.flowchart.nodeDataArray}
					linkDataArray={this.props.flowchart.linkDataArray}
					modelData={this.props.flowchart.modelData}
					skipsDiagramUpdate={this.props.flowchart.skipsDiagramUpdate}
					onDiagramEvent={this.props.flowchart.handleDiagramEvent}
					onModelChange={this.props.flowchart.handleModelChange}
					onFlowchartEvent={this.props.flowchart.handFlowchartEvent}
					getDiagram={this.props.flowchart.getDiagram}
				/>
			</div>
		);
	}
}

export default FlowchartDiagram;
