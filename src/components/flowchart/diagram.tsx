/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import go, { Diagram, GraphObject, Margin } from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';
import FCDiagramDragTool from './tools/draggingTool';
import FCCommandHandler from './tools/commandHandler';
import { DiagramSetting, BaseColors } from './config';
import { FCDiagramEnum, NodeEventEnum, FCActEnum, CallbackFuncEnum } from './enum';
import { FCNodeModel } from './interface';
import ISet from '../../assets/flowchart/i-node-set.png';
import ISetHover from '../../assets/flowchart/i-node-set-hover.png';
import IMenu from '../../assets/flowchart/i-node-menu.png';
import IMenuHover from '../../assets/flowchart/i-node-menu-hover.png';
import IList from '../../assets/flowchart/i-node-list.png';
import IListHover from '../../assets/flowchart/i-node-list-hover.png';

import './diagram.css';

interface FlowChartProps {
	diagramId: string;
	nodeDataArray: Array<go.ObjectData>;
	linkDataArray: Array<go.ObjectData>;
	modelData: go.ObjectData;
	skipsDiagramUpdate: boolean;
	onDiagramEvent: (e: go.DiagramEvent) => void;
	onModelChange: (e: go.IncrementalData) => void;
}

class FlowChartDiagram extends React.Component<FlowChartProps> {
	private isCtrlCopy: boolean = false;

	private SwitchingLoopTerm: string = '切换循环选项'; //  lang.FlowChartDiagram.SwitchingLoopTerm
	private OpenStepSet: string = '打开步骤设置，也可以双击步骤打开'; //  lang.FlowChartDiagram.OpenStepSet
	private ForMoreMenus: string = '更多菜单，也可右键点击步骤'; //lang.FlowChartDiagram.ForMoreMenus
	/**
	 * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
	 */
	private diagramRef: React.RefObject<ReactDiagram>;

	/** @internal */
	constructor(props: FlowChartProps) {
		super(props);
		this.diagramRef = React.createRef();
	}

	componentDidUpdate() {}

	componentDidMount() {
		let tabPane = document.querySelector('#flow-chart-edit-content'); //流程图区域
		//鼠标移出流程图区域后，隐藏所有的小菜单、小弹窗提示
		tabPane &&
			tabPane.addEventListener(
				'mouseleave',
				() => {
					this.hideNodeInfo();
					this.hideTitle();
					this.hideLoopInfo();
					this.hideContextMenu();
				},
				false
			);
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
		const diagramId = this.props.diagramId;

		const myDiagram: Diagram = $(go.Diagram, {
			'undoManager.isEnabled': true,
			draggingTool: new FCDiagramDragTool(this.doDragEvent),
			commandHandler: new FCCommandHandler(this.doEvent),
			contentAlignment: go.Spot.TopCenter,
			initialContentAlignment: go.Spot.RightCenter,
			initialScale: 1.125,
			layout: $(go.TreeLayout, {
				angle: 90,
				treeStyle: go.TreeLayout.StyleLayered,
				layerSpacing: DiagramSetting.layerSpacing,
				comparer: go.LayoutVertex.smartComparer
			}),
			click: this.onClick,
			SelectionMoved: () => {
				myDiagram.layoutDiagram(true);
			},
			InitialLayoutCompleted: this.InitialLayoutCompleted,
			LayoutCompleted: this.LayoutCompleted
			// TextEdited: this.onTextEdited
		});

		// myDiagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
		/**
		 * 节点标题 辅助方法
		 * @param fcDiagramEnum 节点类型
		 */
		const nodeTitleHelper = (fcDiagramEnum: FCDiagramEnum): go.Panel => {
			let obj = {};
			switch (fcDiagramEnum) {
				case FCDiagramEnum.FCNode:
					obj = {
						name: 'node_Title',
						margin: new Margin(1, 0, 0, 0)
					};
					break;
				case FCDiagramEnum.ConditionGroup:
				case FCDiagramEnum.ConditionSwitch:
				case FCDiagramEnum.LoopGroup:
					obj = {
						name: 'group_Title',
						margin: new Margin(0, 5, 0, 5)
					};
					break;
				default:
					break;
			}

			return $(
				go.Panel,
				'Horizontal',
				{},
				$(
					go.TextBlock,
					{
						...obj,
						...{
							editable: DiagramSetting.renameable,
							mouseEnter: this.onMouseEnterTitle,
							mouseLeave: this.onMouseLeaveTitle,
							stroke: BaseColors.font,
							font: DiagramSetting.font,
							textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {
								// todo 1
								// this.props.store.iFlowChart.onSaveNodeNameHandler(newString);
							}
						}
					},
					new go.Binding('text', this.showLabel(), this.covShowLabel)
				)
			);
		};

		/**
		 * 利用 节点 spot 实现靠右
		 * @param fcDiagramEnum
		 */
		const nodeSpotTitleHelper = (fcDiagramEnum: FCDiagramEnum): go.Panel => {
			// 节点基本样式
			let spotCss = {
				alignment: go.Spot.TopRight,
				cursor: 'pointer',
				height: 26,
				width: 50
			};
			// 图标基本样式
			let baseCss = {
				margin: new Margin(0, 0, 0, 0),
				visible: false,
				background: '#2b71ed',
				height: 26,
				width: 25
			};
			let hoverCss = {
				background: '#ffffff'
			};
			switch (fcDiagramEnum) {
				case FCDiagramEnum.ConditionSwitch:
					spotCss = {
						...spotCss,
						...{
							margin: new Margin(0, 10, 0, 0)
						}
					};
					break;
				default:
					break;
			}

			if (fcDiagramEnum == FCDiagramEnum.StopLoopOrFlow) {
				return $(
					go.Panel,
					'Auto',
					{
						...spotCss,
						...{ name: 'action_Spot', width: 25 }
					},
					$(
						go.Panel,
						'Horizontal',
						{
							...baseCss,
							...{
								name: 'node_Imenu',
								click: this.onContextClick,
								mouseEnter: this.onmouseEnterMenuHandler
							}
						},
						$(go.Picture, IMenu, {
							margin: new Margin(0, 6, 0, 6)
						})
					),
					$(
						go.Panel,
						'Horizontal',
						{
							...baseCss,
							...hoverCss,
							...{
								name: 'node_Imenu_Hover',
								click: this.onContextClick,
								mouseLeave: this.onmouseLeaveMenuHandler
							}
						},
						$(go.Picture, IMenuHover, {
							margin: new Margin(0, 6, 0, 6)
						})
					)
				);
			} else {
				return $(
					go.Panel,
					'Auto',
					{
						...spotCss,
						...{ name: 'action_Spot' }
					},
					$(
						go.Panel,
						'Horizontal',
						{},
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...{
									name: 'node_Iset',
									click: this.onSettingClick,
									mouseEnter: this.onmouseEnterSetHandler
								}
							},
							$(go.Picture, ISet, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...hoverCss,
								...{
									name: 'node_Iset_Hover',
									click: this.onSettingClick,
									mouseLeave: this.onmouseLeaveSetHandler
								}
							},
							$(go.Picture, ISetHover, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...{
									name: 'node_Imenu',
									click: this.onContextClick,
									mouseEnter: this.onmouseEnterMenuHandler
								}
							},
							$(go.Picture, IMenu, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...hoverCss,
								...{
									name: 'node_Imenu_Hover',
									click: this.onContextClick,
									mouseLeave: this.onmouseLeaveMenuHandler
								}
							},
							$(go.Picture, IMenuHover, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						)
					)
				); // end output port
			}
		};

		/**
		 * 利用 节点 spot 实现靠右
		 * @param fcDiagramEnum
		 */
		const loopSpotTitleHelper = (): go.Panel => {
			// 节点基本样式
			let spotCss = {
				alignment: go.Spot.TopRight,
				cursor: 'pointer',
				height: 26,
				width: 25,
				margin: new Margin(0, 50, 0, 0)
			};
			// 图标基本样式
			let baseCss = {
				margin: new Margin(0, 0, 0, 0),
				visible: false,
				background: '#2b71ed',
				height: 26,
				width: 25
			};
			let hoverCss = {
				background: '#ffffff'
			};
			return $(
				go.Panel,
				'Auto',
				{
					...spotCss,
					...{ name: 'action_Spot', width: 25 }
				},
				$(
					go.Panel,
					'Horizontal',
					{
						...baseCss,
						...{
							name: 'node_Ilist',
							click: this.handleLoopInfoClick,
							mouseEnter: this.loopInfoMouseEnter
						}
					},
					$(go.Picture, IList, {
						margin: new Margin(0, 6, 0, 6)
					})
				),
				$(
					go.Panel,
					'Horizontal',
					{
						...baseCss,
						...hoverCss,
						...{
							name: 'node_Ilist_Hover',
							click: this.handleLoopInfoClick,
							mouseLeave: this.loopInfoMouseLeave
						}
					},
					$(go.Picture, IListHover, {
						margin: new Margin(0, 6, 0, 6)
					})
				)
			);
		};

		/**
		 * 修改选中样式
		 */
		const drawAdornment = () => {
			//修改线
			myDiagram.linkSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getlinkSelectedCss()),
				$(go.Placeholder)
			);

			//修改组
			myDiagram.groupSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getSelectedCss()),
				$(go.Placeholder)
			);

			//修改点
			myDiagram.nodeSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getSelectedCss()),
				$(go.Placeholder)
			);
		};

		/**
		 * 画线
		 */
		const drawLink = () => {
			myDiagram.linkTemplateMap.add(
				FCDiagramEnum.WFLink,
				$(
					go.Link,
					{
						mouseLeave: this.mouseLeaveHandler,
						mouseEnter: this.mouseEnterHandler,
						mouseDragEnter: this.mouseDragEnterHandler,
						mouseDragLeave: this.mouseDragLeaveHandler,
						selectionChanged: this.onselectionChangedHandler,
						movable: false,
						resizable: false,
						deletable: false
					},
					$(go.Shape, {
						name: 'link_Body',
						stroke: BaseColors.link,
						strokeWidth: 1
					}),
					$(go.Shape, {
						name: 'link_Arr',
						toArrow: 'Standard',
						scale: 1,
						strokeWidth: 0,
						fill: BaseColors.link
					}),
					$(go.Panel, 'Auto', {
						name: 'link_Hover',
						width: DiagramSetting.nodeWith, //增加宽度，方便触发相关事件
						height: DiagramSetting.layerSpacing, //增加高度，方便触发相关事件
						opacity: 0,
						background: BaseColors.link,
						visible: false
					}),
					$(
						go.Panel,
						'Auto',
						{
							name: 'link_Add',
							padding: new go.Margin(5, 0, 5, 0),
							click: this.onAddNodeClick,
							alignment: go.Spot.Top,
							visible: false
						},
						$(go.Shape, 'Circle', {
							name: 'btn_add',
							width: DiagramSetting.linkIconWidth,
							height: DiagramSetting.linkIconWidth,
							fill: BaseColors.link_icon_bg,
							strokeWidth: 0
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.linkIconInWidth,
							height: DiagramSetting.linkIconInWidth,
							fill: null,
							stroke: BaseColors.link_icon,
							strokeWidth: 2
						})
					)
				)
			);
		};

		/**
		 * 画节点
		 */
		const drawNode = (fcNode: FCDiagramEnum) => {
			myDiagram.nodeTemplateMap.add(
				fcNode,
				$(
					go.Node,
					'Auto',
					{
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						movable: DiagramSetting.moveNode,
						click: this.onClick,
						contextClick: this.onContextClick,
						doubleClick: this.onSettingClick,
						selectionChanged: this.onselectionChangedHandler,
						padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
						minSize: new go.Size(DiagramSetting.nodeWith, DiagramSetting.nodeHeight),
						cursor: 'pointer'
					},
					$(
						go.Shape,
						'RoundedRectangle',
						{
							parameter1: DiagramSetting.parameter1,
							name: 'node_Body',
							strokeWidth: 1,
							stroke: BaseColors.transparent,
							fill: BaseColors.backgroud
						}
						//new go.Binding('fill', 'color'),
						//new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
					),
					$(
						go.Panel,
						'Horizontal',
						{
							padding: 5
						},
						// $(go.Picture, IAttention,
						//     {
						//         name: 'node_Iattention',
						//         margin: new Margin(0, 5, 0, 5),
						//         visible: false
						//     }
						// ),
						nodeTitleHelper(fcNode)
					),
					nodeSpotTitleHelper(fcNode)
				)
			);
		};

		/**
		 * 画辅助节点
		 */
		const drawNodeGuide = () => {
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideNode,
				$(
					go.Node,
					'Auto',
					{
						movable: false,
						deletable: false
					},
					$(
						go.Shape,
						'RoundedRectangle',
						{
							strokeWidth: 0,
							fill: BaseColors.transparent
						}
						//new go.Binding('fill', 'color'),
						//new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
					),
					$(
						go.TextBlock,
						{
							editable: false,
							stroke: BaseColors.group_font,
							minSize: new go.Size(DiagramSetting.nodeWith, 10),
							textAlign: 'center',
							isMultiline: true,
							font: DiagramSetting.groupTipFont
						},
						new go.Binding('text', this.showLabel())
					)
				)
			);
		};

		/**
		 * 划循环分组
		 */
		const drawGroupLoop = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.LoopGroup,
				$(
					go.Group,
					'Auto',
					{
						layout: $(go.TreeLayout, {
							angle: 90,

							arrangement: go.TreeLayout.ArrangementHorizontal,
							layerSpacing: DiagramSetting.layerSpacing,
							arrangementSpacing: new go.Size(30, 10)
						}),
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						doubleClick: this.onSettingClick,
						movable: DiagramSetting.moveLoop,
						padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
						isSubGraphExpanded: true,
						resizable: false,
						computesBoundsAfterDrag: false,
						computesBoundsIncludingLinks: false,
						computesBoundsIncludingLocation: false,
						handlesDragDropForMembers: false,
						ungroupable: false,
						graduatedMax: 1,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						contextClick: this.onContextClick
					},
					$(go.Shape, 'RoundedRectangle', {
						name: 'group_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.group_border,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'Vertical',
						{
							name: 'group_Top',
							background: BaseColors.group_bg,
							defaultAlignment: go.Spot.Left,
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Horizontal',
							{
								padding: 5
							},
							$('SubGraphExpanderButton', {
								alignment: go.Spot.Center
							}),
							nodeTitleHelper(FCDiagramEnum.LoopGroup)
						),
						// create a placeholder to represent the area where the contents of the group are
						$(go.Placeholder, {
							background: BaseColors.group_panel_bg,
							padding: new go.Margin(10, 15),
							minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
						})
					), // end Vertical Panel
					loopSpotTitleHelper(),
					nodeSpotTitleHelper(FCDiagramEnum.LoopGroup)
				)
			); // end Group
		};

		/**
		 * 条件分组
		 */
		const drawGroupCond = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.ConditionGroup,
				$(
					go.Group,
					'Auto',
					{
						layout: $(go.GridLayout, {
							sorting: go.TreeLayout.SortingAscending,
							comparer: function (va: any, vb: any) {
								var da = va.data;
								var db = vb.data;
								if (da.sortIndex < db.sortIndex) return -1;
								if (da.sortIndex > db.sortIndex) return 1;
								return 0;
							},
							cellSize: new go.Size(10, 10),
							wrappingWidth: 100000
						}),

						movable: DiagramSetting.moveCond,
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						doubleClick: this.onSettingClick,
						contextClick: this.onContextClick
					},
					$(go.Shape, 'RoundedRectangle', {
						name: 'group_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.group_border,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'Vertical',
						{
							name: 'group_Top',
							background: BaseColors.group_bg,
							defaultAlignment: go.Spot.Left,
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Horizontal',
							{
								padding: 5
							},
							$('SubGraphExpanderButton', {
								alignment: go.Spot.Center
							}),
							nodeTitleHelper(FCDiagramEnum.ConditionGroup)
						),
						// create a placeholder to represent the area where the contents of the group are
						$(go.Placeholder, {
							background: BaseColors.group_panel_bg,
							padding: new go.Margin(10, 10),
							minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
						})
					), // end Vertical Panel
					nodeSpotTitleHelper(FCDiagramEnum.LoopGroup)
				)
			); // end Group
		};

		/**
		 * 条件分支
		 */
		const drawGroupCondBranch = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.ConditionSwitch,
				$(
					go.Group,
					'Auto',
					{
						// define the group's internal layout
						layout: $(go.TreeLayout, {
							angle: 90,
							layerSpacing: DiagramSetting.layerSpacing
						}),

						selectionAdorned: false,
						fromLinkable: false,
						toLinkable: false,
						movable: DiagramSetting.moveCondBranch,
						mouseLeave: this.mouseLeaveHandler,
						mouseEnter: this.mouseEnterHandler,
						resizable: false,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						doubleClick: this.onSettingClick,
						contextClick: this.onContextClick,
						isSubGraphExpanded: true,
						subGraphExpandedChanged: function (_group: any) {
							if (_group instanceof go.Adornment) _group = _group.adornedPart;
							const cmd = myDiagram.commandHandler;
							const lspot = _group.part.findObject('left_Spot');
							const rspot = _group.part.findObject('right_Spot');
							if (_group.isSubGraphExpanded) {
								lspot && (lspot.visible = true);
								rspot && (rspot.visible = true);
								cmd.collapseSubGraph(_group);
							} else {
								cmd.expandSubGraph(_group);
								lspot && (lspot.visible = false);
								rspot && (rspot.visible = false);
							}
						}
					},
					new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
					new go.Binding('height', 'height').makeTwoWay(),

					$(go.Shape, 'RoundedRectangle', {
						name: 'groupBranch_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.transparent,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'RoundedRectangle',
						{
							name: '',
							background: BaseColors.transparent,
							defaultAlignment: go.Spot.Left,
							padding: new go.Margin(0, 8, 0, 8),
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Vertical',
							{
								name: 'group_Top',
								background: BaseColors.group_bg,
								defaultAlignment: go.Spot.Left,
								padding: new go.Margin(0, 1, 1, 1)
							},
							$(
								go.Panel,
								'Horizontal',
								{
									padding: new go.Margin(5, 0, 5, 5)
								},
								$('SubGraphExpanderButton', {
									alignment: go.Spot.Center
								}),
								nodeTitleHelper(FCDiagramEnum.ConditionSwitch)
							),
							// create a placeholder to represent the area where the contents of the group are
							$(go.Placeholder, {
								background: BaseColors.group_panel_bg,
								padding: new go.Margin(10, 15),
								minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
							})
						) // end Vertical Panel
					),
					// input port
					$(
						go.Panel,
						'Auto',
						{
							name: 'left_Spot',
							alignment: go.Spot.Left,
							alignmentFocus: go.Spot.Right,
							width: DiagramSetting.iconWidth + 2,
							height: DiagramSetting.iconWidth + 2,
							cursor: 'pointer',
							opacity: DiagramSetting.spotOpacity,
							click: (_e: go.InputEvent, thisObj: GraphObject) => {
								// todo 2
								// this.props.store.addNodeBy_AddCondtionBranch_Handler({
								// 	eType: NodeEventEnum.AddNodeToBefore,
								// 	setSelected: true,
								// 	actType: 'userDrag',
								// 	toNode: thisObj.part!.data as FCNodeModel
								// });
							}
						},
						$(go.Shape, 'Circle', {
							width: DiagramSetting.iconWidth,
							height: DiagramSetting.iconWidth,
							fill: BaseColors.icon_bg,
							stroke: BaseColors.icon_bg,
							strokeWidth: 1
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.iconInWidth,
							height: DiagramSetting.iconInWidth,
							fill: null,
							stroke: BaseColors.icon,
							strokeWidth: 1
						})
					),
					//output port
					$(
						go.Panel,
						'Auto',
						{
							name: 'right_Spot',
							alignment: go.Spot.Right,
							width: DiagramSetting.iconWidth + 2,
							height: DiagramSetting.iconWidth + 2,
							cursor: 'pointer',
							opacity: DiagramSetting.spotOpacity,
							click: (_e: go.InputEvent, thisObj: GraphObject) => {
								// todo 3
								// this.props.store.addNodeBy_AddCondtionBranch_Handler({
								// 	eType: NodeEventEnum.AddNodeToAfter,
								// 	setSelected: true,
								// 	actType: 'userDrag',
								// 	toNode: thisObj.part!.data as FCNodeModel
								// });
							}
						},
						$(go.Shape, 'Circle', {
							width: DiagramSetting.iconWidth,
							height: DiagramSetting.iconWidth,
							fill: BaseColors.icon_bg,
							stroke: BaseColors.icon_bg,
							strokeWidth: 1
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.iconInWidth,
							height: DiagramSetting.iconInWidth,
							fill: null,
							stroke: BaseColors.icon,
							strokeWidth: 1
						})
					), // end output port
					nodeSpotTitleHelper(FCDiagramEnum.ConditionSwitch)
				)
			);
		};

		/**
		 * 辅助点
		 */
		const drawGuidNodes = () => {
			// 起始点
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideStart,
				$(
					go.Node,
					'Panel',
					{
						margin: new go.Margin(25, 0, 0, 0),
						padding: new go.Margin(5),
						movable: false,
						deletable: false,
						selectable: false
					},
					$(
						go.Panel,
						'Auto',
						$(go.Shape, 'Circle', {
							minSize: new go.Size(DiagramSetting.startWidth, DiagramSetting.startWidth),
							fill: null,
							stroke: BaseColors.start,
							strokeWidth: 1
						}),
						$(go.Shape, 'TriangleRight', {
							width: DiagramSetting.startInWidth,
							height: DiagramSetting.startInWidth,
							fill: BaseColors.start,
							strokeWidth: 0,
							margin: new go.Margin(0, 0, 0, 2)
						})
					)
				)
			);

			//结束点
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideEnd,
				$(
					go.Node,
					'Panel',
					{
						padding: new go.Margin(5, 2),
						movable: false,
						deletable: false,
						selectable: false
					},
					$(
						go.Panel,
						'Auto',
						$(go.Shape, 'Circle', {
							minSize: new go.Size(DiagramSetting.endWidth, DiagramSetting.endWidth),
							fill: null,
							stroke: BaseColors.end,
							strokeWidth: 1
						}),
						$(go.Shape, 'Rectangle', {
							width: DiagramSetting.endInWidth,
							height: DiagramSetting.endInWidth,
							fill: BaseColors.end,
							strokeWidth: 0
						})
					)
				)
			);

			// 辅助起始点
			myDiagram.nodeTemplateMap.add(FCDiagramEnum.WFGuideSubOpen, $(go.Node, 'Panel'));

			// 辅助结束点
			myDiagram.nodeTemplateMap.add(FCDiagramEnum.WFGuideSubClose, $(go.Node, 'Panel'));
		};

		drawAdornment();
		drawNode(FCDiagramEnum.FCNode);
		drawNode(FCDiagramEnum.StopLoopOrFlow);
		drawNodeGuide();
		drawLink();
		drawGroupCond();
		drawGroupCondBranch();
		drawGroupLoop();
		drawGuidNodes();
		// todo 4
		// this.props.store.diagram = myDiagram;
		return myDiagram;
	};

	render() {
		return (
			<ReactDiagram
				ref={this.diagramRef}
				divClassName="diagram-component"
				initDiagram={this.initDiagram}
				nodeDataArray={this.props.nodeDataArray}
				linkDataArray={this.props.linkDataArray}
				modelData={this.props.modelData}
				onModelChange={this.props.onModelChange}
				skipsDiagramUpdate={this.props.skipsDiagramUpdate}
			/>
		);
	}

	//线选中样式
	private getlinkSelectedCss = () => {
		return {
			fill: null,
			stroke: null,
			strokeWidth: 0,
			strokeDashArray: [1, 1]
		};
	};

	//选中样式
	private getSelectedCss = () => {
		return {
			fill: null,
			stroke: BaseColors.highlight,
			strokeWidth: 0,
			strokeDashArray: [2, 2],
			opacity: 1
		};
	};

	//拖拽事件
	doDragEvent = {
		init: () => {
			// todo 5
			// this.props.store.onDragStartNodeHandler();
		},
		dragStart: (from: any) => {
			if (!!!from || !!!from.key) return;
		},
		dragEnd: (from: any, to: any) => {
			if (!!!from || !!!to) return;
			// todo 6
			// if (this.props.store.currNodeKey !== from.key) {
			// 	this.props.store.currNodeKey = from.key;
			// }
			// if (!!to.from && !!to.to) {
			// 	let ev: NodeEvent = {
			// 		eType: NodeEventEnum.DragNode2Link,
			// 		setSelected: true,
			// 		actType: 'userDrag',
			// 		toLink: to as FCLinkModel
			// 	};
			// 	this.props.store.addNodeBy_DragNode2Link_Handler(ev);
			// }
		},
		destroy: () => {
			// todo 7
			//this.props.store.onDragEndNodeHandler();
		}
	};

	doEvent = {
		canDelete: (node: FCNodeModel): boolean => {
			// todo 8
			// if (node && node.type === FCNodeType.Branch) {
			// 	let brother = this.props.store.getSiblingKeys(node.key);
			// 	if (brother) {
			// 		return brother.length > 1;
			// 	}
			// }
			// // console.log(`~test flowchart~ delete`, node.key, this.props.store.currNodeKey)
			// if (node && node.key && node.key !== this.props.store.currNodeKey) return false;

			return true;
		},
		delete: (node: FCNodeModel) => {
			// todo 8,1
			// this.props.store.onDeleteNode(node.key);
		},
		copy: (node: FCNodeModel) => {
			// todo 8.2
			//this.props.store.executeCMD(FCActEnum.Copy, node.key);
		},
		paste: (node: go.Part | null) => {
			// todo 8.3
			// this.isCtrlCopy = true;
			// if (node && node.part && node.part.data) {
			// 	this.props.store.executeCMD(FCActEnum.Paste, node.part.data!.key);
			// } else {
			// 	this.props.store.executeCMD(FCActEnum.Paste, this.props.store.currNodeKey);
			// }
		}
	};

	private createDiagram = (diagramId: string): Diagram => {
		const $ = go.GraphObject.make;
		const myDiagram: Diagram = $(go.Diagram, 'liubl', {
			'undoManager.isEnabled': true,
			draggingTool: new FCDiagramDragTool(this.doDragEvent),
			commandHandler: new FCCommandHandler(this.doEvent),
			contentAlignment: go.Spot.TopCenter,
			initialContentAlignment: go.Spot.RightCenter,
			initialScale: 1.125,
			layout: $(go.TreeLayout, {
				angle: 90,
				treeStyle: go.TreeLayout.StyleLayered,
				layerSpacing: DiagramSetting.layerSpacing,
				comparer: go.LayoutVertex.smartComparer
			}),
			click: this.onClick,
			SelectionMoved: () => {
				myDiagram.layoutDiagram(true);
			},
			InitialLayoutCompleted: this.InitialLayoutCompleted,
			LayoutCompleted: this.LayoutCompleted
		});

		// myDiagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
		/**
		 * 节点标题 辅助方法
		 * @param fcDiagramEnum 节点类型
		 */
		const nodeTitleHelper = (fcDiagramEnum: FCDiagramEnum): go.Panel => {
			let obj = {};
			switch (fcDiagramEnum) {
				case FCDiagramEnum.FCNode:
					obj = {
						name: 'node_Title',
						margin: new Margin(1, 0, 0, 0)
					};
					break;
				case FCDiagramEnum.ConditionGroup:
				case FCDiagramEnum.ConditionSwitch:
				case FCDiagramEnum.LoopGroup:
					obj = {
						name: 'group_Title',
						margin: new Margin(0, 5, 0, 5)
					};
					break;
				default:
					break;
			}

			return $(
				go.Panel,
				'Horizontal',
				{},
				$(
					go.TextBlock,
					{
						...obj,
						...{
							editable: DiagramSetting.renameable,
							mouseEnter: this.onMouseEnterTitle,
							mouseLeave: this.onMouseLeaveTitle,
							stroke: BaseColors.font,
							font: DiagramSetting.font,
							textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {
								// todo 8
								// this.props.store.iFlowChart.onSaveNodeNameHandler(newString);
							}
						}
					},
					new go.Binding('text', this.showLabel(), this.covShowLabel)
				)
			);
		};

		/**
		 * 利用 节点 spot 实现靠右
		 * @param fcDiagramEnum
		 */
		const nodeSpotTitleHelper = (fcDiagramEnum: FCDiagramEnum): go.Panel => {
			// 节点基本样式
			let spotCss = {
				alignment: go.Spot.TopRight,
				cursor: 'pointer',
				height: 26,
				width: 50
			};
			// 图标基本样式
			let baseCss = {
				margin: new Margin(0, 0, 0, 0),
				visible: false,
				background: '#2b71ed',
				height: 26,
				width: 25
			};
			let hoverCss = {
				background: '#ffffff'
			};
			switch (fcDiagramEnum) {
				case FCDiagramEnum.ConditionSwitch:
					spotCss = {
						...spotCss,
						...{
							margin: new Margin(0, 10, 0, 0)
						}
					};
					break;
				default:
					break;
			}

			if (fcDiagramEnum == FCDiagramEnum.StopLoopOrFlow) {
				return $(
					go.Panel,
					'Auto',
					{
						...spotCss,
						...{ name: 'action_Spot', width: 25 }
					},
					$(
						go.Panel,
						'Horizontal',
						{
							...baseCss,
							...{
								name: 'node_Imenu',
								click: this.onContextClick,
								mouseEnter: this.onmouseEnterMenuHandler
							}
						},
						$(go.Picture, IMenu, {
							margin: new Margin(0, 6, 0, 6)
						})
					),
					$(
						go.Panel,
						'Horizontal',
						{
							...baseCss,
							...hoverCss,
							...{
								name: 'node_Imenu_Hover',
								click: this.onContextClick,
								mouseLeave: this.onmouseLeaveMenuHandler
							}
						},
						$(go.Picture, IMenuHover, {
							margin: new Margin(0, 6, 0, 6)
						})
					)
				);
			} else {
				return $(
					go.Panel,
					'Auto',
					{
						...spotCss,
						...{ name: 'action_Spot' }
					},
					$(
						go.Panel,
						'Horizontal',
						{},
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...{
									name: 'node_Iset',
									click: this.onSettingClick,
									mouseEnter: this.onmouseEnterSetHandler
								}
							},
							$(go.Picture, ISet, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...hoverCss,
								...{
									name: 'node_Iset_Hover',
									click: this.onSettingClick,
									mouseLeave: this.onmouseLeaveSetHandler
								}
							},
							$(go.Picture, ISetHover, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...{
									name: 'node_Imenu',
									click: this.onContextClick,
									mouseEnter: this.onmouseEnterMenuHandler
								}
							},
							$(go.Picture, IMenu, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						),
						$(
							go.Panel,
							'Horizontal',
							{
								...baseCss,
								...hoverCss,
								...{
									name: 'node_Imenu_Hover',
									click: this.onContextClick,
									mouseLeave: this.onmouseLeaveMenuHandler
								}
							},
							$(go.Picture, IMenuHover, {
								alignment: go.Spot.Center,
								margin: new Margin(0, 6, 0, 6)
							})
						)
					)
				); // end output port
			}
		};

		/**
		 * 利用 节点 spot 实现靠右
		 * @param fcDiagramEnum
		 */
		const loopSpotTitleHelper = (): go.Panel => {
			// 节点基本样式
			let spotCss = {
				alignment: go.Spot.TopRight,
				cursor: 'pointer',
				height: 26,
				width: 25,
				margin: new Margin(0, 50, 0, 0)
			};
			// 图标基本样式
			let baseCss = {
				margin: new Margin(0, 0, 0, 0),
				visible: false,
				background: '#2b71ed',
				height: 26,
				width: 25
			};
			let hoverCss = {
				background: '#ffffff'
			};
			return $(
				go.Panel,
				'Auto',
				{
					...spotCss,
					...{ name: 'action_Spot', width: 25 }
				},
				$(
					go.Panel,
					'Horizontal',
					{
						...baseCss,
						...{
							name: 'node_Ilist',
							click: this.handleLoopInfoClick,
							mouseEnter: this.loopInfoMouseEnter
						}
					},
					$(go.Picture, IList, {
						margin: new Margin(0, 6, 0, 6)
					})
				),
				$(
					go.Panel,
					'Horizontal',
					{
						...baseCss,
						...hoverCss,
						...{
							name: 'node_Ilist_Hover',
							click: this.handleLoopInfoClick,
							mouseLeave: this.loopInfoMouseLeave
						}
					},
					$(go.Picture, IListHover, {
						margin: new Margin(0, 6, 0, 6)
					})
				)
			);
		};

		/**
		 * 修改选中样式
		 */
		const drawAdornment = () => {
			//修改线
			myDiagram.linkSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getlinkSelectedCss()),
				$(go.Placeholder)
			);

			//修改组
			myDiagram.groupSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getSelectedCss()),
				$(go.Placeholder)
			);

			//修改点
			myDiagram.nodeSelectionAdornmentTemplate = $(
				go.Adornment,
				'Auto',
				$(go.Shape, this.getSelectedCss()),
				$(go.Placeholder)
			);
		};

		/**
		 * 画线
		 */
		const drawLink = () => {
			myDiagram.linkTemplateMap.add(
				FCDiagramEnum.WFLink,
				$(
					go.Link,
					{
						mouseLeave: this.mouseLeaveHandler,
						mouseEnter: this.mouseEnterHandler,
						mouseDragEnter: this.mouseDragEnterHandler,
						mouseDragLeave: this.mouseDragLeaveHandler,
						selectionChanged: this.onselectionChangedHandler,
						movable: false,
						resizable: false,
						deletable: false
					},
					$(go.Shape, {
						name: 'link_Body',
						stroke: BaseColors.link,
						strokeWidth: 1
					}),
					$(go.Shape, {
						name: 'link_Arr',
						toArrow: 'Standard',
						scale: 1,
						strokeWidth: 0,
						fill: BaseColors.link
					}),
					$(go.Panel, 'Auto', {
						name: 'link_Hover',
						width: DiagramSetting.nodeWith, //增加宽度，方便触发相关事件
						height: DiagramSetting.layerSpacing, //增加高度，方便触发相关事件
						opacity: 0,
						background: BaseColors.link,
						visible: false
					}),
					$(
						go.Panel,
						'Auto',
						{
							name: 'link_Add',
							padding: new go.Margin(5, 0, 5, 0),
							click: this.onAddNodeClick,
							alignment: go.Spot.Top,
							visible: false
						},
						$(go.Shape, 'Circle', {
							name: 'btn_add',
							width: DiagramSetting.linkIconWidth,
							height: DiagramSetting.linkIconWidth,
							fill: BaseColors.link_icon_bg,
							strokeWidth: 0
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.linkIconInWidth,
							height: DiagramSetting.linkIconInWidth,
							fill: null,
							stroke: BaseColors.link_icon,
							strokeWidth: 2
						})
					)
				)
			);
		};

		/**
		 * 画节点
		 */
		const drawNode = (fcNode: FCDiagramEnum) => {
			myDiagram.nodeTemplateMap.add(
				fcNode,
				$(
					go.Node,
					'Auto',
					{
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						movable: DiagramSetting.moveNode,
						click: this.onClick,
						contextClick: this.onContextClick,
						doubleClick: this.onSettingClick,
						selectionChanged: this.onselectionChangedHandler,
						padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
						minSize: new go.Size(DiagramSetting.nodeWith, DiagramSetting.nodeHeight),
						cursor: 'pointer'
					},
					$(
						go.Shape,
						'RoundedRectangle',
						{
							parameter1: DiagramSetting.parameter1,
							name: 'node_Body',
							strokeWidth: 1,
							stroke: BaseColors.transparent,
							fill: BaseColors.backgroud
						}
						//new go.Binding('fill', 'color'),
						//new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
					),
					$(
						go.Panel,
						'Horizontal',
						{
							padding: 5
						},
						// $(go.Picture, IAttention,
						//     {
						//         name: 'node_Iattention',
						//         margin: new Margin(0, 5, 0, 5),
						//         visible: false
						//     }
						// ),
						nodeTitleHelper(fcNode)
					),
					nodeSpotTitleHelper(fcNode)
				)
			);
		};

		/**
		 * 画辅助节点
		 */
		const drawNodeGuide = () => {
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideNode,
				$(
					go.Node,
					'Auto',
					{
						movable: false,
						deletable: false
					},
					$(
						go.Shape,
						'RoundedRectangle',
						{
							strokeWidth: 0,
							fill: BaseColors.transparent
						}
						//new go.Binding('fill', 'color'),
						//new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
					),
					$(
						go.TextBlock,
						{
							editable: false,
							stroke: BaseColors.group_font,
							minSize: new go.Size(DiagramSetting.nodeWith, 10),
							textAlign: 'center',
							isMultiline: true,
							font: DiagramSetting.groupTipFont
						},
						new go.Binding('text', this.showLabel())
					)
				)
			);
		};

		/**
		 * 划循环分组
		 */
		const drawGroupLoop = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.LoopGroup,
				$(
					go.Group,
					'Auto',
					{
						layout: $(go.TreeLayout, {
							angle: 90,

							arrangement: go.TreeLayout.ArrangementHorizontal,
							layerSpacing: DiagramSetting.layerSpacing,
							arrangementSpacing: new go.Size(30, 10)
						}),
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						doubleClick: this.onSettingClick,
						movable: DiagramSetting.moveLoop,
						padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
						isSubGraphExpanded: true,
						resizable: false,
						computesBoundsAfterDrag: false,
						computesBoundsIncludingLinks: false,
						computesBoundsIncludingLocation: false,
						handlesDragDropForMembers: false,
						ungroupable: false,
						graduatedMax: 1,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						contextClick: this.onContextClick
					},
					$(go.Shape, 'RoundedRectangle', {
						name: 'group_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.group_border,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'Vertical',
						{
							name: 'group_Top',
							background: BaseColors.group_bg,
							defaultAlignment: go.Spot.Left,
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Horizontal',
							{
								padding: 5
							},
							$('SubGraphExpanderButton', {
								alignment: go.Spot.Center
							}),
							nodeTitleHelper(FCDiagramEnum.LoopGroup)
						),
						// create a placeholder to represent the area where the contents of the group are
						$(go.Placeholder, {
							background: BaseColors.group_panel_bg,
							padding: new go.Margin(10, 15),
							minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
						})
					), // end Vertical Panel
					loopSpotTitleHelper(),
					nodeSpotTitleHelper(FCDiagramEnum.LoopGroup)
				)
			); // end Group
		};

		/**
		 * 条件分组
		 */
		const drawGroupCond = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.ConditionGroup,
				$(
					go.Group,
					'Auto',
					{
						layout: $(go.GridLayout, {
							sorting: go.TreeLayout.SortingAscending,
							comparer: function (va: any, vb: any) {
								var da = va.data;
								var db = vb.data;
								if (da.sortIndex < db.sortIndex) return -1;
								if (da.sortIndex > db.sortIndex) return 1;
								return 0;
							},
							cellSize: new go.Size(10, 10),
							wrappingWidth: 100000
						}),

						movable: DiagramSetting.moveCond,
						mouseEnter: this.mouseEnterHandler,
						mouseLeave: this.mouseLeaveHandler,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						doubleClick: this.onSettingClick,
						contextClick: this.onContextClick
					},
					$(go.Shape, 'RoundedRectangle', {
						name: 'group_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.group_border,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'Vertical',
						{
							name: 'group_Top',
							background: BaseColors.group_bg,
							defaultAlignment: go.Spot.Left,
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Horizontal',
							{
								padding: 5
							},
							$('SubGraphExpanderButton', {
								alignment: go.Spot.Center
							}),
							nodeTitleHelper(FCDiagramEnum.ConditionGroup)
						),
						// create a placeholder to represent the area where the contents of the group are
						$(go.Placeholder, {
							background: BaseColors.group_panel_bg,
							padding: new go.Margin(10, 10),
							minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
						})
					), // end Vertical Panel
					nodeSpotTitleHelper(FCDiagramEnum.LoopGroup)
				)
			); // end Group
		};

		/**
		 * 条件分支
		 */
		const drawGroupCondBranch = () => {
			myDiagram.groupTemplateMap.add(
				FCDiagramEnum.ConditionSwitch,
				$(
					go.Group,
					'Auto',
					{
						// define the group's internal layout
						layout: $(go.TreeLayout, {
							angle: 90,
							layerSpacing: DiagramSetting.layerSpacing
						}),

						selectionAdorned: false,
						fromLinkable: false,
						toLinkable: false,
						movable: DiagramSetting.moveCondBranch,
						mouseLeave: this.mouseLeaveHandler,
						mouseEnter: this.mouseEnterHandler,
						resizable: false,
						selectionChanged: this.onselectionChangedHandler,
						click: this.onClick,
						doubleClick: this.onSettingClick,
						contextClick: this.onContextClick,
						isSubGraphExpanded: true,
						subGraphExpandedChanged: function (_group: any) {
							if (_group instanceof go.Adornment) _group = _group.adornedPart;
							const cmd = myDiagram.commandHandler;
							const lspot = _group.part.findObject('left_Spot');
							const rspot = _group.part.findObject('right_Spot');
							if (_group.isSubGraphExpanded) {
								lspot && (lspot.visible = true);
								rspot && (rspot.visible = true);
								cmd.collapseSubGraph(_group);
							} else {
								cmd.expandSubGraph(_group);
								lspot && (lspot.visible = false);
								rspot && (rspot.visible = false);
							}
						}
					},
					new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
					new go.Binding('height', 'height').makeTwoWay(),

					$(go.Shape, 'RoundedRectangle', {
						name: 'groupBranch_main',
						parameter1: DiagramSetting.parameter1Group,
						fill: BaseColors.transparent,
						stroke: BaseColors.transparent,
						strokeWidth: 1
					}),
					$(
						go.Panel,
						'RoundedRectangle',
						{
							name: '',
							background: BaseColors.transparent,
							defaultAlignment: go.Spot.Left,
							padding: new go.Margin(0, 8, 0, 8),
							cursor: 'pointer'
						},
						$(
							go.Panel,
							'Vertical',
							{
								name: 'group_Top',
								background: BaseColors.group_bg,
								defaultAlignment: go.Spot.Left,
								padding: new go.Margin(0, 1, 1, 1)
							},
							$(
								go.Panel,
								'Horizontal',
								{
									padding: new go.Margin(5, 0, 5, 5)
								},
								$('SubGraphExpanderButton', {
									alignment: go.Spot.Center
								}),
								nodeTitleHelper(FCDiagramEnum.ConditionSwitch)
							),
							// create a placeholder to represent the area where the contents of the group are
							$(go.Placeholder, {
								background: BaseColors.group_panel_bg,
								padding: new go.Margin(10, 15),
								minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
							})
						) // end Vertical Panel
					),
					// input port
					$(
						go.Panel,
						'Auto',
						{
							name: 'left_Spot',
							alignment: go.Spot.Left,
							alignmentFocus: go.Spot.Right,
							width: DiagramSetting.iconWidth + 2,
							height: DiagramSetting.iconWidth + 2,
							cursor: 'pointer',
							opacity: DiagramSetting.spotOpacity,
							click: (_e: go.InputEvent, thisObj: GraphObject) => {
								// todo 9
								// this.props.store.addNodeBy_AddCondtionBranch_Handler({
								// 	eType: NodeEventEnum.AddNodeToBefore,
								// 	setSelected: true,
								// 	actType: 'userDrag',
								// 	toNode: thisObj.part!.data as FCNodeModel
								// });
							}
						},
						$(go.Shape, 'Circle', {
							width: DiagramSetting.iconWidth,
							height: DiagramSetting.iconWidth,
							fill: BaseColors.icon_bg,
							stroke: BaseColors.icon_bg,
							strokeWidth: 1
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.iconInWidth,
							height: DiagramSetting.iconInWidth,
							fill: null,
							stroke: BaseColors.icon,
							strokeWidth: 1
						})
					),
					//output port
					$(
						go.Panel,
						'Auto',
						{
							name: 'right_Spot',
							alignment: go.Spot.Right,
							width: DiagramSetting.iconWidth + 2,
							height: DiagramSetting.iconWidth + 2,
							cursor: 'pointer',
							opacity: DiagramSetting.spotOpacity,
							click: (_e: go.InputEvent, thisObj: GraphObject) => {
								// todo 10
								// this.props.store.addNodeBy_AddCondtionBranch_Handler({
								// 	eType: NodeEventEnum.AddNodeToAfter,
								// 	setSelected: true,
								// 	actType: 'userDrag',
								// 	toNode: thisObj.part!.data as FCNodeModel
								// });
							}
						},
						$(go.Shape, 'Circle', {
							width: DiagramSetting.iconWidth,
							height: DiagramSetting.iconWidth,
							fill: BaseColors.icon_bg,
							stroke: BaseColors.icon_bg,
							strokeWidth: 1
						}),
						$(go.Shape, 'PlusLine', {
							width: DiagramSetting.iconInWidth,
							height: DiagramSetting.iconInWidth,
							fill: null,
							stroke: BaseColors.icon,
							strokeWidth: 1
						})
					), // end output port
					nodeSpotTitleHelper(FCDiagramEnum.ConditionSwitch)
				)
			);
		};

		/**
		 * 辅助点
		 */
		const drawGuidNodes = () => {
			// 起始点
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideStart,
				$(
					go.Node,
					'Panel',
					{
						margin: new go.Margin(25, 0, 0, 0),
						padding: new go.Margin(5),
						movable: false,
						deletable: false,
						selectable: false
					},
					$(
						go.Panel,
						'Auto',
						$(go.Shape, 'Circle', {
							minSize: new go.Size(DiagramSetting.startWidth, DiagramSetting.startWidth),
							fill: null,
							stroke: BaseColors.start,
							strokeWidth: 1
						}),
						$(go.Shape, 'TriangleRight', {
							width: DiagramSetting.startInWidth,
							height: DiagramSetting.startInWidth,
							fill: BaseColors.start,
							strokeWidth: 0,
							margin: new go.Margin(0, 0, 0, 2)
						})
					)
				)
			);

			//结束点
			myDiagram.nodeTemplateMap.add(
				FCDiagramEnum.WFGuideEnd,
				$(
					go.Node,
					'Panel',
					{
						padding: new go.Margin(5, 2),
						movable: false,
						deletable: false,
						selectable: false
					},
					$(
						go.Panel,
						'Auto',
						$(go.Shape, 'Circle', {
							minSize: new go.Size(DiagramSetting.endWidth, DiagramSetting.endWidth),
							fill: null,
							stroke: BaseColors.end,
							strokeWidth: 1
						}),
						$(go.Shape, 'Rectangle', {
							width: DiagramSetting.endInWidth,
							height: DiagramSetting.endInWidth,
							fill: BaseColors.end,
							strokeWidth: 0
						})
					)
				)
			);

			// 辅助起始点
			myDiagram.nodeTemplateMap.add(FCDiagramEnum.WFGuideSubOpen, $(go.Node, 'Panel'));

			// 辅助结束点
			myDiagram.nodeTemplateMap.add(FCDiagramEnum.WFGuideSubClose, $(go.Node, 'Panel'));
		};

		drawAdornment();
		drawNode(FCDiagramEnum.FCNode);
		drawNode(FCDiagramEnum.StopLoopOrFlow);
		drawNodeGuide();
		drawLink();
		drawGroupCond();
		drawGroupCondBranch();
		drawGroupLoop();
		drawGuidNodes();
		// todo 11
		// this.props.store.diagram = myDiagram;
		return myDiagram;
	};

	/**
	 * 计算名称显示长度， 字母算1个长度，文字算2个长度
	 */
	private gbLenght = function (str: string) {
		let len = 0;
		for (let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
				len += 2;
			} else {
				len++;
			}
		}
		return { len };
	};

	/**
	 * 鼠标移入显示全名val
	 */
	private onMouseEnterTitle = (_val: any, _obj: any): void => {
		let node = (_obj as any).part;
		// todo 12
		// if (!this.props.store.contextMenuIsShow && !this.props.store.loopInfoListIsShow) {
		// 	if (typeof _val != 'string') {
		// 		if (node.data && node.data.label) {
		// 			let { len } = this.gbLenght(node.data.label);
		// 			if (len < 20) {
		// 				return;
		// 			} else {
		// 				this.changeNodeInfoOpacity(0);
		// 			}
		// 		}
		// 	} else {
		// 		this.changeNodeInfoOpacity(0);
		// 	}
		// }
	};

	/**
	 * 鼠标移出隐藏
	 */
	private onMouseLeaveTitle = (_val: any, _obj: any): void => {
		this.hideTitle();
	};

	/**
	 * 返回名字
	 */
	private covShowLabel = (_val: any, _targetObj: any): string => {
		if (_val && typeof _val == 'string') {
			let { len } = this.gbLenght(_val);
			if (len > 20) return `${_val.slice(0, 9)}···`;
		}
		return _val;
	};

	/**
	 * 返回字段
	 */
	private showLabel = (): string => {
		if (DiagramSetting.showKey) return 'key';
		if (DiagramSetting.showLabel) return DiagramSetting.showLabel;
		return 'label';
	};

	/**
	 * 单击
	 */
	private onClick = (_e: go.InputEvent, _obj?: GraphObject): void => {
		try {
			// todo 13
			// if (_obj) {
			// 	//点击在已知节点上
			// 	let node = (_obj as any).part;
			// 	if (node && node.part && node.part.data && node.part.data.key) {
			// 		if (node.part.data.key !== this.props.store.currNodeKey) {
			// 			this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
			// 			this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 			this.props.store.currNodeKey = node.part.data.key;
			// 		}
			// 	}
			// } else {
			// 	//点击在未知节点上
			// 	if (this.props.store.currNodeKey == '') return; //重复点击在未知节点上 直接返回
			// 	this.props.store.diagram.clearSelection();
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 	this.props.store.currNodeKey = '';
			// }
		} catch (e) {}
	};

	/**
	 * 切换选中
	 * @param node
	 */
	private onselectionChangedHandler = (_node: any) => {
		this.hideContextMenu();
		this.hideAddNodeMenu();
		// todo 14
		// this.props.store.addNodeMenuLen = HalfNodeMenu;
		if (_node && _node.data && _node.data.diagramType == FCDiagramEnum.WFLink) {
			return;
		}
		if (_node && _node.diagram) {
			// todo 15
			// if (_node.isSelected) {
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 	// this.props.store.preSelectedNodeKey = _node.key;
			// 	this.props.store.currNodeKey = _node.key;
			// 	// this.props.store._reSetSelected();
			// } else {
			// 	this.props.store.diagram.clearSelection();
			// 	this.props.store.preSelectedNodeKey.add(_node.key);
			// 	//this.props.store.setNodeCss(_node);
			// }
		}
	};

	/**
	 * 鼠标移上
	 * @param e
	 * @param obj
	 */
	private mouseEnterHandler = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// todo 16
		// if (node && node.diagram) {
		// 	if (node.data.type == 'LoopAction') {
		// 		let nodeData = this.props.store.iFlowChart.onNodeDataHandler(node.data);
		// 		if ((nodeData as any).LoopType == 'FixedItem') {
		// 			this.props.store._setNodeCss(node, 'mouseEnter', false);
		// 		} else {
		// 			this.props.store._setNodeCss(node, 'mouseEnter');
		// 		}
		// 	} else {
		// 		this.props.store._setNodeCss(node, 'mouseEnter');
		// 	}
		// }
		// if (node && node.diagram) {
		// 	this.props.store.setLinkShowAdd2(node, 'hover');
		// }

		// this.props.store.contextNodeKey = (obj as any).part.data.key;
		// if (node && node.data && node.data.diagramType == FCDiagramEnum.WFLink) {
		// 	return;
		// }

		this.hideContextMenu();
		this.hideAddNodeMenu();
		//结束循环，结束流程两种节点类型不显示节点信息提示
		if (node.data.diagramType != FCDiagramEnum.StopLoopOrFlow) {
		}
	};

	/**
	 * 鼠标移开
	 * @param e
	 * @param obj
	 */
	private mouseLeaveHandler = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 17
			//this.props.store._setNodeCss(node, 'mouseLeave');
		}
		this.hideNodeInfo();
		this.hideTitle();
		this.hideLoopInfo();
		this.hideContextMenu();

		// todo 18
		// if (node && node.part && node.part.data && node.part.data.key === this.props.store.currNodeKey) {
		// 	return;
		// }
		// if (node && node.diagram) {
		// 	this.props.store._setNodeCss(node);
		// }
		// if (node && node.diagram) {
		// 	this.props.store.setLinkShowAdd2(node);
		// }
	};

	/**
	 * 鼠标 拖拽移上
	 * @param e
	 * @param obj
	 */
	private mouseDragEnterHandler = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 19
			// this.props.store._setLinkCss(node, 'drag');
		}
	};

	/**
	 * 鼠标 拖拽移开
	 * @param e
	 * @param obj
	 */
	private mouseDragLeaveHandler = (_e: go.InputEvent, obj: GraphObject, _obj1: GraphObject): void => {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 20
			// this.props.store._setLinkCss(node);
		}
	};

	private loopInfoMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			this.changeNodeInfoOpacity(0);
			if (_obj) {
				this.onMouseEnterTitle(this.SwitchingLoopTerm, _obj);

				let node = (_obj as any).part;
				if (node) {
					let list = node.findObject('node_Ilist');
					if (list) list.visible = false;
					let listHover = node.findObject('node_Ilist_Hover');
					if (listHover) listHover.visible = true;
				}
			}
		} catch (e) {}
	};

	private loopInfoMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			this.changeNodeInfoOpacity(1);
			if (_obj) {
				this.hideTitle();

				let node = (_obj as any).part;
				if (node) {
					let list = node.findObject('node_Ilist');
					if (list) list.visible = true;
					let listHover = node.findObject('node_Ilist_Hover');
					if (listHover) listHover.visible = false;
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移入设置图标切换
	 */
	private onmouseEnterSetHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.onMouseEnterTitle(this.OpenStepSet, _obj);

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = false;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = true;
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移出设置图标切换
	 */
	private onmouseLeaveSetHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.hideTitle();

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = true;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移入更多菜单图标切换
	 */
	private onmouseEnterMenuHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.onMouseEnterTitle(this.ForMoreMenus, _obj);
				let node = (_obj as any).part;
				if (node) {
					let menu = node.findObject('node_Imenu');
					if (menu) {
						menu.visible = false;
					}
					let menuHover = node.findObject('node_Imenu_Hover');
					if (menuHover) {
						menuHover.visible = true;
					}
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移出更多菜单图标切换
	 */
	private onmouseLeaveMenuHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.hideTitle();

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Imenu');
					if (set) set.visible = true;
					let setting = node.findObject('node_Imenu_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	private onSettingClick = (e: go.InputEvent, obj: GraphObject): void => {
		// todo 20
		// this.props.store.onShowEditPageHandler();
	};

	/**
	 * 点击更多菜单（流程图上面的三个点按钮）,此方法用于显示更多菜单并定位
	 */
	private onContextClick = (_e: go.InputEvent, _obj: GraphObject): void => {
		// todo 21
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// this.hideNodeInfo();
		// this.hideTitle();
		// this.hideLoopInfo();
		// let contextMenuEl = document.getElementsByClassName(this.props.store.domIdcontextMenu)[0] as HTMLElement | null;
		// if (contextMenuEl) {
		// 	contextMenuEl.style.display = 'block';
		// 	let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// 	contextMenuEl.style.left = mousePt.x - 90 + 'px';
		// 	contextMenuEl.style.top = mousePt.y + 'px';
		// 	this.props.store.contextMenuIsShow = true;
		// }
	};

	/**
	 * 点击展示循环列表具体内容
	 */
	private handleLoopInfoClick = async (_e: go.InputEvent, _obj: GraphObject) => {
		// todo 22
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// this.hideNodeInfo();
		// this.hideTitle();
		// this.hideContextMenu();
		// let node = (_obj as any).part;
		// let loopInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getLoopInfo
		// )[0] as HTMLElement | null;
		// let res = await this.props.store.iFlowChart.onNodeInfoHandler(node.data);
		// this.props.store.loopInfoData = res[2].table;
		// if (this.props.store.loopInfoData.data.length == 0) {
		// 	return;
		// }
		// let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// //节点信息框的宽度
		// let loopInfoElWidth = 260;
		// //流程图区域的宽度
		// this.props.store.loopInfoListIsShow = true;
	};

	/**
	 * 点击加号增加节点
	 */
	private onAddNodeClick = (_e: go.InputEvent, _obj: GraphObject): void => {
		// todo 23
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// let addNodeMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.addNodeMenu
		// )[0] as HTMLElement | null;
		// if (addNodeMenuEl) {
		// 	addNodeMenuEl.style.display = 'block';
		// 	let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// 	addNodeMenuEl.style.left = mousePt.x - 75 + 'px';
		// 	addNodeMenuEl.style.top = mousePt.y + 'px';
		// 	let point = this.props.store.diagram.transformViewToDoc(new go.Point(mousePt.x, mousePt.y));
		// 	this.props.store.addPointNode = this.props.store.diagram.findPartAt(point, true);
		// }
	};

	InitialLayoutCompleted = (_e: go.DiagramEvent): void => {
		// console.log(`~ test flowchart ~ InitialLayoutCompleted 123`)
		// var dia = this.props.store.diagram;
		// dia.div.style.height = (dia.documentBounds.height + 24) + "px";
	};

	/**
	 * 流程图画完
	 */
	private LayoutCompleted = (_e: go.DiagramEvent): void => {
		if (this.isCtrlCopy) {
			// todo 24
			// let n = this.props.store.diagram.findNodeForKey(this.props.store.currNodeKey);
			// if (n && n.part) {
			// 	//做选中处理   这里可能会多次触发。
			// 	//console.log(`~ test flowchart ~ LayoutCompleted 456`, this.props.store.callbackFunc);
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Paste);
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 	// console.log(n.location.y)
			// 	this.props.store._doCallback();
			// 	this.props.store._reSetSelected();
			// }
		}
	};

	hideTitle = (): void => {
		// todo 25
		// let titleEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.fcTitle
		// )[0] as HTMLElement | null;
		// if (titleEl) {
		// 	titleEl.style.display = 'none';
		// }
		// this.changeNodeInfoOpacity(1);
	};

	hideContextMenu = (): void => {
		// let contextMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.domIdcontextMenu
		// )[0] as HTMLElement | null;
		// if (contextMenuEl) {
		// 	contextMenuEl.style.display = 'none';
		// 	this.props.store.contextMenuIsShow = false;
		// }
	};

	hideAddNodeMenu = (): void => {
		// let addNodeMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.addNodeMenu
		// )[0] as HTMLElement | null;
		// if (addNodeMenuEl) {
		// 	addNodeMenuEl.style.display = 'none';
		// }
	};

	hideNodeInfo = (): void => {
		// let nodeInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getNodeInfo
		// )[0] as HTMLElement | null;
		// if (nodeInfoEl) {
		// 	nodeInfoEl.style.display = 'none';
		// }
	};

	hideLoopInfo = (): void => {
		// let loopInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getLoopInfo
		// )[0] as HTMLElement | null;
		// if (loopInfoEl) {
		// 	// loopInfoEl.style.display = "none";
		// 	loopInfoEl.style.left = '99999px';
		// 	this.props.store.loopInfoListIsShow = false;
		// }
	};

	changeNodeInfoOpacity = (n: number): void => {
		// let nodeInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getNodeInfo
		// )[0] as HTMLElement | null;
		// if (nodeInfoEl) {
		// 	nodeInfoEl.style.opacity = `${n}`;
		// }
	};
}

export default FlowChartDiagram;
