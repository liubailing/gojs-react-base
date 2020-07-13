import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import Base from './base';
import BaseChangese from './baseChanges';
import { HandleEnum } from '../enum';
const $ = go.GraphObject.make;

export default class DrawLink extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}
	/**
	 * 画线
	 */
	getLink = (): go.Link => {
		return $(
			go.Link,
			{
				mouseLeave: this.onMouseLeave,
				mouseEnter: this.onMouseEnter,
				mouseDragEnter: this.onMouseDragEnter,
				mouseDragLeave: this.onMouseDragLeave,
				// selectionChanged: this.onselectionChangedHandler,
				movable: false,
				resizable: false,
				deletable: false
			},
			$(go.Shape, {
				name: 'link_Body',
				stroke: BaseColors.link,
				strokeWidth: 1
			}),
			$(go.Shape, {
				name: 'link_Arr',
				toArrow: 'Standard',
				scale: 1,
				strokeWidth: 0,
				fill: BaseColors.link
			}),
			$(go.Panel, 'Auto', {
				name: 'link_Hover',
				width: DiagramSetting.nodeWith, //增加宽度，方便触发相关事件
				height: DiagramSetting.layerSpacing, //增加高度，方便触发相关事件
				opacity: 0,
				background: BaseColors.link,
				visible: true
			}),
			$(
				go.Panel,
				'Auto',
				{
					name: 'link_Add',
					padding: new go.Margin(5, 0, 5, 0),
					click: this.onClick,
					alignment: go.Spot.Top,
					visible: false
				},
				$(go.Shape, 'Circle', {
					name: 'btn_add',
					width: DiagramSetting.linkIconWidth,
					height: DiagramSetting.linkIconWidth,
					fill: BaseColors.link_icon_bg,
					strokeWidth: 0
				}),
				$(go.Shape, 'PlusLine', {
					width: DiagramSetting.linkIconInWidth,
					height: DiagramSetting.linkIconInWidth,
					fill: null,
					stroke: BaseColors.link_icon,
					strokeWidth: 2
				})
			)
		);
	};

	onMouseEnter = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		BaseChangese.setLinkCss(node, true);
	};

	onMouseLeave = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		BaseChangese.setLinkCss(node, false);
	};

	onClick = (e: go.InputEvent, obj: GraphObject) => {
		this.doFlowchartEvent(e, obj, HandleEnum.ShowLineMenu, this.callBack);
	};

	onMouseDragEnter = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		BaseChangese.setLinkCss(node, true);
	};

	onMouseDragLeave = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		BaseChangese.setLinkCss(node, false);
	};
}

// const drawLink = new DrawLink();

// export default drawLink;
