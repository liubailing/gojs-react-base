import go from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import Base from './base';

const $ = go.GraphObject.make;

export class DrawSimple extends Base {
	/**
	 * 起始点
	 */
	getStart = (): go.Part =>
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
		);

	/**
	 * 结束点
	 */
	getEnd = (): go.Part =>
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
		);

	/**
	 * 流程指示点
	 */
	getGuidNode = (): go.Part =>
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
				// new go.Binding('fill', 'color'),
				// new go.Binding('fill', 'isHighlighted', this.getHighlightedColor).ofObject() // binding source is Node.isHighlighted
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
				new go.Binding('text', 'label')
			)
		);
}

const drawSimple = new DrawSimple();

export default drawSimple;
