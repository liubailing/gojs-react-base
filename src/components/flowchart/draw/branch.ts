import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';

const $ = go.GraphObject.make;

export class DrawBranch extends Base {
	getBranch(): go.Group {
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
				selectionChanged: this.onselectionChangedHandler,
				click: this.onClick,
				doubleClick: this.onSettingClick,
				contextClick: this.onContextClick,
				isSubGraphExpanded: true,
				subGraphExpandedChanged: function (_group: any) {
					if (_group instanceof go.Adornment) _group = _group.adornedPart;
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
						DrawTitle.getTitle(DiagramEnum.ConditionSwitch)
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
						// 	toNode: thisObj.part!.data as NodeModel
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
						// 	toNode: thisObj.part!.data as NodeModel
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
			DrawSpot.getSpot(DiagramEnum.ConditionSwitch)
		);
	}

	onMouseLeave(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, false);
			BaseChanges.setBranchCss(node, false);
		}
	}

	onMouseEnter(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, true);
			BaseChanges.setBranchCss(node, true);
		}
	}
}

const drawBranch = new DrawBranch();

export default drawBranch;
