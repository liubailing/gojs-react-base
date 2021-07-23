import go, { GraphObject } from '@octopus/gojs';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';

const $ = go.GraphObject.make;

export default class DrawNode extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}

	getNode(): go.Part {
		const $DrawSpot = new DrawSpot(this.callBack);
		return $(
			go.Node,
			'Auto',
			new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
			new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
			{
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
				movable: DiagramSetting.moveNode,
				// click: this.onClick,
				// contextClick: this.onContextClick,
				// doubleClick: this.onSettingClick,
				// selectionChanged: this.onselectionChangedHandler,
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
					// stroke: BaseColors.border
					// fill: BaseColors.backgroud
				},
				new go.Binding('fill', 'isSelected', this.getNodeFill).ofObject(),
				new go.Binding('stroke', 'isSelected', this.getNodeStroke).ofObject()
			),
			$(
				go.Panel,
				'Horizontal',
				{
					padding: 5
				},
				DrawTitle.getTitle(DiagramEnum.FCNode)
			),
			$DrawSpot.getSpot(DiagramEnum.FCNode)
		);
	}

	/**
	 * 返回背景颜色
	 */
	private getNodeStroke = (_val: any, _targetObj: any): string =>
	// const node = (_targetObj as any).part;
	_val ? BaseColors.highlight : BaseColors.border;

	/**
	 * 返回背景颜色
	 */
	private getNodeFill = (_val: any, _targetObj: any): string =>
		// const node = (_targetObj as any).part;
		_val ? BaseColors.highlight : BaseColors.backgroud;

	/**
	 * 返回名字
	 */
	private getNodeWidth = (_val: any, _targetObj: any): number => {
		const node = (_targetObj as any).part;
		return _val ? node.width() + 10 : node.width();
	};

	onMouseLeave(_e: go.InputEvent, obj: GraphObject): void {
		const node = (obj as any).part;
		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setActionCss(node, false);
			BaseChanges.setNodeCss(node, false);
		}
	}

	onMouseEnter(_e: go.InputEvent, obj: GraphObject): void {
		const node = (obj as any).part;
		if (node && node.diagram) {
			BaseChanges.setActionCss(node, true);
			BaseChanges.setNodeCss(node, true);
		}
	}
}

// const drawNode = new DrawNode();

// export default drawNode;
