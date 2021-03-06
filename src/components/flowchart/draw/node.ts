import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors, HoverColors } from '../config';
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
			{ name: 'node_Title', toolTip: this.tooltiptemplate },
			{
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
				movable: DiagramSetting.moveNode,
				// click: this.onClick,
				// contextClick: this.onContextClick,
				// doubleClick: this.onSettingClick,
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
					stroke: BaseColors.transparent
					// fill: BaseColors.backgroud
				},
				new go.Binding('fill', 'isSelected', this.getNodeFill).ofObject(),
				new go.Binding('width', 'isSelected', this.getNodeWidth).ofObject()
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

	/**
	 * 返回名字
	 */
	private getNodeFill = (_val: any, _targetObj: any): string => {
		// const node = (_targetObj as any).part;
		// if (node && node.data && node.data.isSel) return BaseColors.highlight;
		return _val ? BaseColors.highlight : BaseColors.backgroud;
	};

	/**
	 * 返回名字
	 */
	private getNodeWidth = (_val: any, _targetObj: any): number => {
		const node = (_targetObj as any).part;
		// if (node && node.data && node.data.isSel) return BaseColors.highlight;
		return _val ? node.width() + 10 : node.width();
	};

	onMouseLeave(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		// console.log('node', node);
		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setSpotCss(node, false);
			BaseChanges.setNodeCss(node, false);
		}
	}

	onMouseEnter(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		console.log('node', node.isSelected);
		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, true);
			BaseChanges.setNodeCss(node, true);
		}
	}

	// define tooltips for nodes
	tooltiptemplate = $(
		'ToolTip',
		{ 'Border.fill': BaseColors.group_font, 'Border.stroke': BaseColors.group_bg, visible: true },
		$(
			go.TextBlock,
			{
				font: 'bold 8pt Helvetica, bold Arial, sans-serif',
				wrap: go.TextBlock.WrapFit,
				margin: 5
			},
			new go.Binding('text', 'label')
		)
	);
}

const drawNode = new DrawNode();

export default drawNode;
