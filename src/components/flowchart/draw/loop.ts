import go, { GraphObject, Margin } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';
import IList from '../../../assets/flowchart/i-node-list.png';
import IListHover from '../../../assets/flowchart/i-node-list-hover.png';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';

const $ = go.GraphObject.make;

export class DrawLoop extends Base {
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
						click: this.handleLoopInfoClick,
						mouseEnter: this.loopInfoMouseEnter
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
						click: this.handleLoopInfoClick,
						mouseLeave: this.loopInfoMouseLeave
					}
				},
				$(go.Picture, IListHover, {
					margin: new Margin(0, 6, 0, 6)
				})
			)
		);
	};

	getLoop(): go.Group {
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
				doubleClick: this.onSettingClick,
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
				selectionChanged: this.onselectionChangedHandler,
				click: this.onClick,
				contextClick: this.onContextClick
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
			DrawSpot.getSpot(DiagramEnum.LoopGroup)
		);
	}

	/**
	 * 点击展示循环列表具体内容
	 */
	private handleLoopInfoClick = async (_e: go.InputEvent, _obj: GraphObject) => {
		// todo 22
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// this.hideNodeInfo();
		// this.hideTitle();
		// this.hideContextMenu();
		// let node = (_obj as any).part;
		// let loopInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getLoopInfo
		// )[0] as HTMLElement | null;
		// let res = await this.props.store.iFlowchart.onNodeInfoHandler(node.data);
		// this.props.store.loopInfoData = res[2].table;
		// if (this.props.store.loopInfoData.data.length == 0) {
		// 	return;
		// }
		// let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// //节点信息框的宽度
		// let loopInfoElWidth = 260;
		// //流程图区域的宽度
		// this.props.store.loopInfoListIsShow = true;
	};

	/**
	 *
	 */
	private loopInfoMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			// this.changeNodeInfoOpacity(0);
			if (_obj) {
				// this.onMouseEnterTitle(this.SwitchingLoopTerm, _obj);
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
	private loopInfoMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
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

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, false);
			BaseChanges.setListCss(node, false);
		}
	};

	onMouseEnter = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		// console.log('node', node);

		if (node && node.diagram) {
			BaseChanges.setSpotCss(node, true);
			BaseChanges.setListCss(node, true);
		}
	};
}

const drawLoop = new DrawLoop();

export default drawLoop;
