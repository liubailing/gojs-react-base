import go from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
import DrawTitle from './title';
import DrawSpot from './spot';
const $ = go.GraphObject.make;

export class DrawBreak extends Base {
	getBreak(): go.Part {
		return $(
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
				},
				new go.Binding('fill', 'color')
				//new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
			),
			$(
				go.Panel,
				'Horizontal',
				{
					padding: 5
				},
				DrawTitle.getTitle(DiagramEnum.FCNode)
			),
			DrawSpot.getSpotMenu(DiagramEnum.FCNode)
		);
	}
}

const drawBreak = new DrawBreak();

export default drawBreak;
