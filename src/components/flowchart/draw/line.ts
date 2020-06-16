import go, { GraphObject } from 'gojs';
import { DiagramSetting, BaseColors, HoverColors } from '../config';
import Base from './base';
const $ = go.GraphObject.make;

export class DrawLink extends Base {
	/**
	 * 画线
	 */
	getLink = (): go.Link => {
		return $(
			go.Link,
			{
				mouseLeave: this.mouseLeaveHandler,
				mouseEnter: this.mouseEnterHandler,
				mouseDragEnter: this.mouseDragEnterHandler,
				mouseDragLeave: this.mouseDragLeaveHandler,
				selectionChanged: this.onselectionChangedHandler,
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
					click: this.onAddNodeClick,
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

	mouseEnterHandler = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		const link_Body = node.findObject('link_Body');
		const link_Arr = node.findObject('link_Arr');
		const link_Hover = node.findObject('link_Hover');
		const link_Add = node.findObject('link_Add');
		if (link_Body) {
			link_Body.stroke = HoverColors.link;
		}
		if (link_Arr) {
			link_Arr.fill = HoverColors.link;
		}
		if (link_Hover) link_Hover.visible = true;
		if (link_Add) link_Add.visible = true;
		super.mouseEnterHandler(_e, obj);
		// debugger;
	};

	mouseLeaveHandler = (_e: go.InputEvent, obj: GraphObject) => {
		const node = (obj as any).part;
		if (!node) return;
		const link_Body = node.findObject('link_Body');
		const link_Arr = node.findObject('link_Arr');
		const link_Hover = node.findObject('link_Hover');
		const link_Add = node.findObject('link_Add');
		if (link_Body) {
			link_Body.stroke = BaseColors.link;
		}
		if (link_Arr) {
			link_Arr.fill = BaseColors.link;
		}
		if (link_Hover) link_Hover.visible = false;
		if (link_Add) link_Add.visible = false;
		super.mouseLeaveHandler(_e, obj);
	};
}

const drawLink = new DrawLink();

export default drawLink;
