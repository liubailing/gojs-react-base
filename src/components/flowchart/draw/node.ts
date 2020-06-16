import go, { Diagram, GraphObject, Margin } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
const $ = go.GraphObject.make;

export class DrawNode extends Base {


	getNode(): go.Part {
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
				this.nodeTitleHelper(DiagramEnum.FCNode)
			),
			this.nodeSpotTitleHelper(DiagramEnum.FCNode)
		);
	}
}

const drawNode = new DrawNode();

export default drawNode;
