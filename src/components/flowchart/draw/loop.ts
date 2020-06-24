import go, { GraphObject, Margin } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum, HandleEnum } from '../enum';
import IList from '../../../assets/flowchart/i-node-list.png';
import IListHover from '../../../assets/flowchart/i-node-list-hover.png';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';

const $ = go.GraphObject.make;

export default class DrawLoop extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}
	/**
	 * 利用 节点 spot 实现靠右
	 * @param DiagramEnum
	 */
	loopSpotTitleHelper = (): go.Panel => {
		// 节点基本样式
		let spotCss = {
			alignment: go.Spot.TopRight,
			cursor: 'pointer',
			height: 26,
			width: 25,
			margin: new Margin(0, 50, 0, 0)
		};
		// 图标基本样式
		let baseCss = {
			margin: new Margin(0, 0, 0, 0),
			visible: false,
			height: 26,
			width: 25
		};
		let hoverCss = {
			background: '#ffffff'
		};
		return $(
			go.Panel,
			'Auto',
			{
				...spotCss,
				...{ name: 'action_Spot', width: 25 }
			},
			$(
				go.Panel,
				'Horizontal',
				{
					...baseCss,
					...{
						name: 'node_Ilist',
						mouseEnter: this.onListMouseEnter
					}
				},
				$(go.Picture, IList, {
					margin: new Margin(0, 6, 0, 6)
				})
			),
			$(
				go.Panel,
				'Horizontal',
				{
					...baseCss,
					...hoverCss,
					...{
						name: 'node_Ilist_Hover',
						click: this.onListClick,
						mouseLeave: this.onListMouseLeave
					}
				},
				$(go.Picture, IListHover, {
					margin: new Margin(0, 6, 0, 6)
				})
			)
		);
	};

	getLoop(): go.Group {
		let $DrawSpot = new DrawSpot(this.callBack);
		return $(
			go.Group,
			'Auto',
			{
				layout: $(go.TreeLayout, {
					angle: 90,

					arrangement: go.TreeLayout.ArrangementHorizontal,
					layerSpacing: DiagramSetting.layerSpacing,
					arrangementSpacing: new go.Size(30, 10)
				}),
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
				// doubleClick: this.onSettingClick,
				movable: DiagramSetting.moveLoop,
				padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
				isSubGraphExpanded: true,
				resizable: false,
				computesBoundsAfterDrag: false,
				computesBoundsIncludingLinks: false,
				computesBoundsIncludingLocation: false,
				handlesDragDropForMembers: false,
				ungroupable: false,
				graduatedMax: 1,
				selectionChanged: this.doGroupCss_SelectionChanged
				// click: this.onClick
				// contextClick: this.onContextClick
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
					DrawTitle.getTitle(DiagramEnum.LoopGroup)
				),
				// create a placeholder to represent the area where the contents of the group are
				$(go.Placeholder, {
					background: BaseColors.group_panel_bg,
					padding: new go.Margin(10, 15),
					minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
				})
			), // end Vertical Panel
			this.loopSpotTitleHelper(),
			$DrawSpot.getSpot(DiagramEnum.LoopGroup)
		);
	}

	/**
	 * 点击展示循环列表具体内容
	 */
	private onListClick = async (_e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(_e, _obj, HandleEnum.ShowNodeInfo, this.callBack);
	};

	/**
	 *
	 */
	private onListMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				let node = (_obj as any).part;
				if (node) {
					let list = node.findObject('node_Ilist');
					if (list) list.visible = false;
					let listHover = node.findObject('node_Ilist_Hover');
					if (listHover) listHover.visible = true;
				}
			}
		} catch (e) {}
	};

	/**
	 *
	 */
	private onListMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			// this.changeNodeInfoOpacity(1);
			if (_obj) {
				// this.hideTitle();
				let node = (_obj as any).part;
				if (node) {
					let list = node.findObject('node_Ilist');
					if (list) list.visible = true;
					let listHover = node.findObject('node_Ilist_Hover');
					if (listHover) listHover.visible = false;
				}
			}
		} catch (e) {}
	};

	onMouseLeave = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setGroupCss(node, false);
			BaseChanges.setListCss(node, false);
		}
	};

	onMouseEnter = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setGroupCss(node, true);
			BaseChanges.setListCss(node, true);
		}
	};
}

// const drawLoop = new DrawLoop();

// export default drawLoop;
