/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import go, { Diagram } from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';
import { DraggingTool, ClickSelectingTool, CommandHandler, ContextMenuTool } from './tools';
import { DiagramSetting } from './config';
import { DiagramEnum, HandleEnum } from './enum';
import { INodeEvent } from './interface';
import {
	DrawLink,
	DrawSimple,
	DrawNode,
	DrawLoop,
	DrawBranch,
	DrawCondition,
	DrawAdornment,
	DrawContextMenu
} from './draw';
import './diagram.css';

interface FlowchartProps {
	getDiagram: (d: go.Diagram) => void;
	diagramId: string;
	nodeDataArray: Array<go.ObjectData>;
	linkDataArray: Array<go.ObjectData>;
	modelData: go.ObjectData;
	skipsDiagramUpdate: boolean;
	onDiagramEvent: (e: go.DiagramEvent) => void;
	onModelChange: (e: go.IncrementalData) => void;
	onFlowchartEvent: (e: INodeEvent) => void;
}

class FlowchartDiagram extends React.Component<FlowchartProps> {
	/**
	 * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
	 */
	diagramRef: React.RefObject<ReactDiagram>;

	/** @internal */
	constructor(props: FlowchartProps) {
		super(props);
		this.diagramRef = React.createRef();
	}

	/**
	 * Get the diagram reference and add any desired diagram listeners.
	 * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
	 */
	public componentDidMount() {
		if (!this.diagramRef.current) {
			return;
		}
		const diagram = this.diagramRef.current.getDiagram();
		if (diagram instanceof go.Diagram) {
			diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
			diagram.addDiagramListener('BackgroundSingleClicked', this.props.onDiagramEvent);
			diagram.addDiagramListener('LostFocus', this.props.onDiagramEvent);
			diagram.addDiagramListener('ObjectContextClicked', this.props.onDiagramEvent);
			diagram.addDiagramListener('ViewportBoundsChanged', this.props.onDiagramEvent);
			diagram.addDiagramListener('ObjectSingleClicked', this.props.onDiagramEvent);
		}
		if (diagram) {
			this.props.getDiagram(diagram);
			const e: INodeEvent = {
				eType: HandleEnum.Init
			} as INodeEvent;
			this.props.onFlowchartEvent(e);
		}
	}

	/**
	 * Get the diagram reference and remove listeners that were added during mounting.
	 */
	public componentWillUnmount() {
		if (!this.diagramRef.current) {
			return;
		}
		const diagram = this.diagramRef.current.getDiagram();
		if (diagram instanceof go.Diagram) {
			diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
			diagram.removeDiagramListener('BackgroundSingleClicked', this.props.onDiagramEvent);
			diagram.removeDiagramListener('LostFocus', this.props.onDiagramEvent);
			diagram.removeDiagramListener('ObjectContextClicked', this.props.onDiagramEvent);
			diagram.removeDiagramListener('ViewportBoundsChanged', this.props.onDiagramEvent);
			diagram.removeDiagramListener('ObjectSingleClicked', this.props.onDiagramEvent);
		}
	}
	/**
	 * Diagram initialization method, which is passed to the ReactDiagram component.
	 * This method is responsible for making the diagram and initializing the model, any templates,
	 * and maybe doing other initialization tasks like customizing tools.
	 * The model's data should not be set here, as the ReactDiagram component handles that.
	 */
	private initDiagram = (): go.Diagram => {
		// const _this = this;
		const $ = go.GraphObject.make;
		const $DrawNode = new DrawNode(this.props.onFlowchartEvent);

		let myDiagram: Diagram = $(go.Diagram, this.props.diagramId, {
			'undoManager.isEnabled': true,
			'animationManager.duration': 2,
			draggingTool: new DraggingTool(this.props.onFlowchartEvent),
			clickSelectingTool: new ClickSelectingTool(),
			commandHandler: new CommandHandler(this.props.onFlowchartEvent),
			contextMenuTool: new ContextMenuTool(this.props.onFlowchartEvent),
			contentAlignment: go.Spot.TopCenter,
			initialContentAlignment: go.Spot.RightCenter,
			// hoverDelay: 100,
			initialScale: 1,
			layout: $(go.TreeLayout, {
				angle: 90,
				treeStyle: go.TreeLayout.StyleLayered,
				layerSpacing: DiagramSetting.layerSpacing,
				comparer: go.LayoutVertex.smartComparer
			}),
			// click: this.onClick,
			SelectionMoved: () => {
				myDiagram.layoutDiagram(true);
			},
			InitialLayoutCompleted: this.InitialLayoutCompleted,
			LayoutCompleted: this.LayoutCompleted,
			model: $(go.GraphLinksModel, {
				// IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
				linkKeyProperty: 'key',
				// positive keys for nodes
				makeUniqueKeyFunction: (m: go.Model, data: any) => {
					let k = data.key || 1;
					while (m.findNodeDataForKey(k)) {
						k++;
					}
					data.key = k;
					return k;
				},
				// negative keys for links
				makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
					let k = data.key || -1;
					while (m.findLinkDataForKey(k)) {
						k--;
					}
					data.key = k;
					return k;
				}
			})
			// TextEdited: this.onTextEdited
		});

		myDiagram.animationManager.initialAnimationStyle = go.AnimationManager.None;

		/**
		 * 画线
		 */
		// myDiagram.linkTemplateMap.add(DiagramEnum.WFLink, new DrawLink(this.props.onFlowchartEvent).getLink());

		/**
		 * 画线
		 */
		myDiagram.linkTemplate = new DrawLink(this.props.onFlowchartEvent).getLink();

		/**
		 * 画节点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.FCNode, $DrawNode.getNode());
		// myDiagram.nodeTemplate = DrawNode.getNode();
		// myDiagram.nodeTemplate.contextMenu = $(
		// 	go.ContextMenuTool,
		// 	$('ContextMenuButton', $(go.TextBlock, 'Vacate Position'), {
		// 		click: function (e, obj) {}
		// 	}),
		// 	$('ContextMenuButton', $(go.TextBlock, 'Remove Role'), {
		// 		click: function (e, obj) {
		// 			// reparent the subtree to this node's boss, then remove the node
		// 		}
		// 	}),
		// 	$('ContextMenuButton', $(go.TextBlock, 'Remove Department'), {
		// 		click: function (e, obj) {}
		// 	})
		// );
		/**
		 * 结束流程图、循环
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.StopLoopOrFlow, $DrawNode.getNode());

		/**
		 * 画辅助节点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.WFGuideNode, DrawSimple.getGuidNode());

		/**
		 * 划循环分组
		 */
		myDiagram.groupTemplateMap.add(DiagramEnum.LoopGroup, new DrawLoop(this.props.onFlowchartEvent).getLoop()); // end Group

		/**
		 * 条件分组
		 */
		myDiagram.groupTemplateMap.add(
			DiagramEnum.ConditionGroup,
			new DrawCondition(this.props.onFlowchartEvent).getCondition()
		);

		/**
		 * 条件分支
		 */
		myDiagram.groupTemplateMap.add(
			DiagramEnum.ConditionSwitch,
			new DrawBranch(this.props.onFlowchartEvent).getBranch()
		);

		/**
		 * 起始点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.WFGuideStart, DrawSimple.getStart());

		/**
		 * 结束点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.WFGuideEnd, DrawSimple.getEnd());

		/**
		 * 辅助起始点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.WFGuideSubOpen, $(go.Node, 'Panel'));

		/**
		 * 辅助结束点
		 */
		myDiagram.nodeTemplateMap.add(DiagramEnum.WFGuideSubClose, $(go.Node, 'Panel'));

		/**
		 * 设置辅助  选择后去掉框
		 */
		myDiagram = DrawAdornment.setAdornment(myDiagram);

		// Since we have only one main element, we don't have to declare a hide method,
		// we can set mainElement and GoJS will hide it automatically
		// var myContextMenu = $(go.HTMLInfo, );
		myDiagram.contextMenu = new DrawContextMenu(myDiagram, this.props.onFlowchartEvent).getContextMenu();

		// Overview;
		$(
			go.Overview,
			`myOverviewDiv${this.props.diagramId}`, // the HTML DIV element for the Overview
			{ observed: myDiagram, contentAlignment: go.Spot.Center }
		);

		// myDiagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
		// myDiagram.animationManager.duration = 2;
		// tell it which Diagram to show and pan
		return myDiagram;
	};

	render() {
		return (
			<>
				<ReactDiagram
					ref={this.diagramRef}
					divClassName={`diagram-component diagram-${this.props.diagramId}`}
					initDiagram={this.initDiagram}
					nodeDataArray={this.props.nodeDataArray}
					linkDataArray={this.props.linkDataArray}
					modelData={this.props.modelData}
					onModelChange={this.props.onModelChange}
					skipsDiagramUpdate={this.props.skipsDiagramUpdate}
				/>
				<div id={`myOverviewDiv${this.props.diagramId}`} className="diagram-overview" />
			</>
		);
	}

	/**
	 *
	 */
	private InitialLayoutCompleted = (_e: go.DiagramEvent): void => {};

	/**
	 * 流程图画完
	 */
	private LayoutCompleted = (_e: go.DiagramEvent): void => {
		console.log(`~ test flowchart ~ LayoutCompleted 123`);
		const e: INodeEvent = {
			eType: HandleEnum.ReRender
		} as INodeEvent;
		this.props.onFlowchartEvent(e);
	};
}

export default FlowchartDiagram;
