import go, { GraphObject } from '@octopus/gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum, HandleEnum } from '../enum';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';
import { ToolTip } from './toolTip';
import NodeStore from '../store/nodeStore';

const $ = go.GraphObject.make;

export default class DrawBranch extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}

	getBranch(): go.Group {
		const $DrawSpot = new DrawSpot(this.callBack);
		return $(
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
				mouseLeave: this.onMouseLeave,
				mouseEnter: this.onMouseEnter,
				resizable: false,
				selectionChanged: this.doGroupCss_SelectionChanged,
				// click: this.onClick,
				// doubleClick: this.onSettingClick,
				// contextClick: this.onContextClick,
				isSubGraphExpanded: true,
				subGraphExpandedChanged(_group: any) {
					if (_group instanceof go.Adornment) {
						_group = _group.adornedPart;
					}
					// const cmd = myDiagram.commandHandler;
					const lspot = _group.part.findObject('left_Spot');
					const rspot = _group.part.findObject('right_Spot');
					if (_group.isSubGraphExpanded) {
						lspot && (lspot.visible = true);
						rspot && (rspot.visible = true);
						// cmd.collapseSubGraph(_group);
					} else {
						// cmd.expandSubGraph(_group);
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
				// fill: "#000",
				stroke: BaseColors.transparent,
				strokeWidth: 1
			}),
			$(
				go.Panel,
				'Auto',
				{
					name: '',
					background: BaseColors.transparent,
					defaultAlignment: go.Spot.Left,
					padding: new go.Margin(0, 8, 0, 8),
					cursor: 'pointer',
				},
				$(go.Shape, 'RoundedRectangle', {
					name: 'groupBranch_main',
					parameter1: DiagramSetting.parameter1Group,
					// fill: BaseColors.transparent,
					fill: "#000",
					stroke: BaseColors.transparent,
					strokeWidth: 1
				}),
				$(
					go.Panel,
					'Vertical',
					{
						name: 'group_Top',
						// background: BaseColors.group_bg,
						background: "red",
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
						DrawTitle.getTitle(DiagramEnum.ConditionSwitch)
					),
					// create a placeholder to represent the area where the contents of the group are
					$(go.Placeholder, {
						background: BaseColors.group_panel_bg,
						padding: new go.Margin(10, 15),
						minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
					}),
					
				) // end Vertical Panel
			),
			// input port
			$(
				go.Panel,
				'Auto',
				ToolTip.getTitle(NodeStore.strWFGuideBranch),
				{
					name: 'left_Spot',
					alignment: go.Spot.Left,
					alignmentFocus: go.Spot.Right,
					width: DiagramSetting.iconWidth + 2,
					height: DiagramSetting.iconWidth + 2,
					cursor: 'pointer',
					opacity: DiagramSetting.spotOpacity,
					click: this.onLeftClick
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
			// output port
			$(
				go.Panel,
				'Auto',
				ToolTip.getTitle(NodeStore.strWFGuideBranch),
				{
					name: 'right_Spot',
					alignment: go.Spot.Right,
					width: DiagramSetting.iconWidth + 2,
					height: DiagramSetting.iconWidth + 2,
					cursor: 'pointer',
					opacity: DiagramSetting.spotOpacity,
					click: this.onRightClick
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
			$DrawSpot.getSpotMenu(DiagramEnum.ConditionSwitch)
		);
	}

	onMouseLeave(_e: go.InputEvent, obj: GraphObject): void {
		const node = (obj as any).part;

		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setGroupCss(node, false);
			BaseChanges.setBranchCss(node, false);
			BaseChanges.setActionCss(node, false);
		}
	}

	onMouseEnter(_e: go.InputEvent, obj: GraphObject): void {
		const node = (obj as any).part;
		if (node && node.diagram) {
			BaseChanges.setGroupCss(node, true);
			BaseChanges.setBranchCss(node, true);
			BaseChanges.setActionCss(node, true);
		}
	}

	onLeftClick = (e: go.InputEvent, obj: GraphObject): void => {
		super.doFlowchartEvent(e, obj, HandleEnum.AddBranchToLeft, this.callBack);
	};

	onRightClick = (e: go.InputEvent, obj: GraphObject): void => {
		super.doFlowchartEvent(e, obj, HandleEnum.AddBranchToRight, this.callBack);

		// let node = (obj as any).part;
		// if (node && node.diagram) {
		// 	BaseChanges.setSpotCss(node, true);
		// 	BaseChanges.setBranchCss(node, true);
		// }
	};

	doGroupCss_SelectionChanged = (_targetObj: any) => {
		/** 点击无效区域 */
		const node = (_targetObj as any).part;
		if (node && node.isSelected) {
			BaseChanges.setGroupCss(node, true);
			BaseChanges.setBranchCss(node, true);
		} else {
			BaseChanges.setGroupCss(node, false);
			BaseChanges.setBranchCss(node, false);
			BaseChanges.setActionHide(node);
		}
		// }
	};
}

// const drawBranch = new DrawBranch();

// export default drawBranch;
