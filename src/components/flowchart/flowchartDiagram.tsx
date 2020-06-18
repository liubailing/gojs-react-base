/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as go from 'gojs';
import * as React from 'react';
import { produce } from 'immer';

import Diagram from './diagram';
import { HanderFlowchart } from './handle';
import './flowchartDiagram.css';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface FlowchartState {
	nodeDataArray: Array<go.ObjectData>;
	linkDataArray: Array<go.ObjectData>;
	modelData: go.ObjectData;
	selectedData: go.ObjectData | null;
	skipsDiagramUpdate: boolean;
}

export interface FlowchartProps {
	flowchart: HanderFlowchart;
}

class FlowchartDiagram extends React.Component<FlowchartProps, FlowchartState> {
	// Maps to store key -> arr index for quick lookups
	private mapNodeKeyIdx: Map<go.Key, number>;
	private mapLinkKeyIdx: Map<go.Key, number>;

	constructor(props: FlowchartProps) {
		super(props);
		// init maps
		this.mapNodeKeyIdx = new Map<go.Key, number>();
		this.mapLinkKeyIdx = new Map<go.Key, number>();
		this.init();
		//
		this.refreshNodeIndex(this.state.nodeDataArray);
		this.refreshLinkIndex(this.state.linkDataArray);
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
		this.mapNodeKeyIdx.clear();
		nodeArr.forEach((n: go.ObjectData, idx: number) => {
			this.mapNodeKeyIdx.set(n.key, idx);
		});
	}

	/**
	 * Update map of link keys to their index in the array.
	 */
	private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
		this.mapLinkKeyIdx.clear();
		linkArr.forEach((l: go.ObjectData, idx: number) => {
			this.mapLinkKeyIdx.set(l.key, idx);
		});
	}

	/**
	 * Handle any relevant DiagramEvents, in this case just selection changes.
	 * On ChangedSelection, find the corresponding data and set the selectedData state.
	 * @param e a GoJS DiagramEvent
	 */
	public handleDiagramEvent(e: go.DiagramEvent) {
		const name = e.name;
		switch (name) {
			case 'ChangedSelection': {
				const sel = e.subject.first();
				this.setState(
					produce((draft: FlowchartState) => {
						if (sel) {
							if (sel instanceof go.Node) {
								const idx = this.mapNodeKeyIdx.get(sel.key);
								if (idx !== undefined && idx >= 0) {
									const nd = draft.nodeDataArray[idx];
									draft.selectedData = nd;
								}
							} else if (sel instanceof go.Link) {
								const idx = this.mapLinkKeyIdx.get(sel.key);
								if (idx !== undefined && idx >= 0) {
									const ld = draft.linkDataArray[idx];
									draft.selectedData = ld;
								}
							}
						} else {
							draft.selectedData = null;
						}
					})
				);
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
		this.setState(
			produce((draft: FlowchartState) => {
				let narr = draft.nodeDataArray;
				if (modifiedNodeData) {
					modifiedNodeData.forEach((nd: go.ObjectData) => {
						modifiedNodeMap.set(nd.key, nd);
						const idx = this.mapNodeKeyIdx.get(nd.key);
						if (idx !== undefined && idx >= 0) {
							narr[idx] = nd;
							if (draft.selectedData && draft.selectedData.key === nd.key) {
								draft.selectedData = nd;
							}
						}
					});
				}
				if (insertedNodeKeys) {
					insertedNodeKeys.forEach((key: go.Key) => {
						const nd = modifiedNodeMap.get(key);
						const idx = this.mapNodeKeyIdx.get(key);
						if (nd && idx === undefined) {
							// nodes won't be added if they already exist
							this.mapNodeKeyIdx.set(nd.key, narr.length);
							narr.push(nd);
						}
					});
				}
				if (removedNodeKeys) {
					narr = narr.filter((nd: go.ObjectData) => {
						if (removedNodeKeys.includes(nd.key)) {
							return false;
						}
						return true;
					});
					draft.nodeDataArray = narr;
					this.refreshNodeIndex(narr);
				}

				let larr = draft.linkDataArray;
				if (modifiedLinkData) {
					modifiedLinkData.forEach((ld: go.ObjectData) => {
						modifiedLinkMap.set(ld.key, ld);
						const idx = this.mapLinkKeyIdx.get(ld.key);
						if (idx !== undefined && idx >= 0) {
							larr[idx] = ld;
							if (draft.selectedData && draft.selectedData.key === ld.key) {
								draft.selectedData = ld;
							}
						}
					});
				}
				if (insertedLinkKeys) {
					insertedLinkKeys.forEach((key: go.Key) => {
						const ld = modifiedLinkMap.get(key);
						const idx = this.mapLinkKeyIdx.get(key);
						if (ld && idx === undefined) {
							// links won't be added if they already exist
							this.mapLinkKeyIdx.set(ld.key, larr.length);
							larr.push(ld);
						}
					});
				}
				if (removedLinkKeys) {
					larr = larr.filter((ld: go.ObjectData) => {
						if (removedLinkKeys.includes(ld.key)) {
							return false;
						}
						return true;
					});
					draft.linkDataArray = larr;
					this.refreshLinkIndex(larr);
				}
				// handle model data changes, for now just replacing with the supplied object
				if (modifiedModelData) {
					draft.modelData = modifiedModelData;
				}
				draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
			})
		);
	}

	/**
	 * Handle inspector changes, and on input field blurs, update node/link data state.
	 * @param path the path to the property being modified
	 * @param value the new value of that property
	 * @param isBlur whether the input event was a blur, indicating the edit is complete
	 */
	public handleInputChange(path: string, value: string, isBlur: boolean) {
		this.setState(
			produce((draft: FlowchartState) => {
				const data = draft.selectedData as go.ObjectData; // only reached if selectedData isn't null
				data[path] = value;
				if (isBlur) {
					const key = data.key;
					if (key < 0) {
						// negative keys are links
						const idx = this.mapLinkKeyIdx.get(key);
						if (idx !== undefined && idx >= 0) {
							draft.linkDataArray[idx] = data;
							draft.skipsDiagramUpdate = false;
						}
					} else {
						const idx = this.mapNodeKeyIdx.get(key);
						if (idx !== undefined && idx >= 0) {
							draft.nodeDataArray[idx] = data;
							draft.skipsDiagramUpdate = false;
						}
					}
				}
			})
		);
	}

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
					nodeDataArray={this.state.nodeDataArray}
					linkDataArray={this.state.linkDataArray}
					modelData={this.state.modelData}
					skipsDiagramUpdate={this.state.skipsDiagramUpdate}
					onDiagramEvent={this.handleDiagramEvent}
					onModelChange={this.handleModelChange}
				/>
			</div>
		);
	}
}

export default FlowchartDiagram;
