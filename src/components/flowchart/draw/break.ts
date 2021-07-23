import go from '@octopus/gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
import DrawTitle from './title';

const $ = go.GraphObject.make;

export default class DrawBreak extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}
	getBreak(): go.Part {
		// const $DrawSpot = new DrawSpot(this.callBack);
		return $(
			go.Node,
			'Auto',
			{
				// mouseEnter: this.mouseEnterHandler,
				// mouseLeave: this.mouseLeaveHandler,
				movable: DiagramSetting.moveNode,
				// click: this.onClick,
				// contextClick: this.onContextClick,
				// doubleClick: this.onSettingClick,
				// selectionChanged: this.onselectionChangedHandler,
				padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
				minSize: new go.Size(DiagramSetting.groupWith, DiagramSetting.nodeHeight),
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
				// new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
			),
			$(
				go.Panel,
				'Horizontal',
				{
					padding: 5
				},
				DrawTitle.getTitle(DiagramEnum.FCNode)
			)
			// $DrawSpot.getSpotMenu(DiagramEnum.FCNode)
		);
	}
}

// const drawBreak = new DrawBreak();

// export default drawBreak;
