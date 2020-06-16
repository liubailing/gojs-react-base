import go, { Diagram, GraphObject, Margin } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
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
					this.nodeTitleHelper(DiagramEnum.ConditionGroup)
				),
				// create a placeholder to represent the area where the contents of the group are
				$(go.Placeholder, {
					background: BaseColors.group_panel_bg,
					padding: new go.Margin(10, 10),
					minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
				})
			), // end Vertical Panel
			this.nodeSpotTitleHelper(DiagramEnum.LoopGroup)
		);
	}
}

const drawCondition = new DrawCondition();

export default drawCondition;
