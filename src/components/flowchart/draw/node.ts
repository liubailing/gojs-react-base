import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';

const $ = go.GraphObject.make;

export class DrawNode extends Base {
	getNode(): go.Part {
		return $(
			go.Node,
			'Auto',
			{
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
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
			DrawSpot.getSpot(DiagramEnum.FCNode)
		);
	}

	onMouseLeave(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, false);
			BaseChanges.setNodeCss(node, false);
		}
	}

	onMouseEnter(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, true);
			BaseChanges.setNodeCss(node, true);
		}
	}
}

const drawNode = new DrawNode();

export default drawNode;
