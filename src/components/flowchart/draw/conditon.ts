import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';
const $ = go.GraphObject.make;

export class DrawCondition extends Base {
	getCondition(): go.Group {
		return $(
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
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
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
					DrawTitle.getTitle(DiagramEnum.ConditionGroup)
				),
				// create a placeholder to represent the area where the contents of the group are
				$(go.Placeholder, {
					background: BaseColors.group_panel_bg,
					padding: new go.Margin(10, 10),
					minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
				})
			), // end Vertical Panel
			DrawSpot.getSpot(DiagramEnum.LoopGroup)
		);
	}

	onMouseLeave = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			// this.setCss(node, false);
			BaseChanges.setSpotCss(node, false);
		}
	};

	onMouseEnter = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			// this.setCss(node, true);
			BaseChanges.setSpotCss(node, true);
		}
	};
}

const drawCondition = new DrawCondition();

export default drawCondition;
