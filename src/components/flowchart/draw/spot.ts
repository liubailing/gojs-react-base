import go, { GraphObject, Margin } from '@octopus/gojs';
import { DiagramEnum } from '../enum';
import { HandleEnum } from '../enum';
import IList from '../../../assets/images/flowchart/i-node-list.png';
import IListHover from '../../../assets/images/flowchart/i-node-list-hover.png';
import IMenu from '../../../assets/images/flowchart/i-node-menu.png';
import IMenuHover from '../../../assets/images/flowchart/i-node-menu-hover.png';
import Base from './base';

const $ = go.GraphObject.make;

/** 节点基本样式 */
let spotCss = {
	alignment: go.Spot.TopRight,
	cursor: 'pointer',
	height: 26,
	width: 26
};
/** 图标基本样式 */
const baseCss = {
	margin: new Margin(0, 0, 0, 0),
	visible: false,
	// background: '#2b71ed',
	height: 26,
	width: 25
};
/** 图标基本样式 */
const hoverCss = {
	background: '#ffffff'
};

export default class DrawSpot extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}
	/**
	 * 默认节点操作菜单
	 * @param diagramEnum
	 */
	getSpot(diagramEnum: DiagramEnum): go.Panel {
		switch (diagramEnum) {
			case DiagramEnum.ConditionSwitch:
				spotCss = {
					...spotCss,
					...{
						margin: new Margin(1, 1, 0, 0)
					}
				};
				break;
			default:
				break;
		}

		return $(
			go.Panel,
			'Auto',
			{
				...spotCss,
				...{ name: 'action_Spot' }
			},
			// $(go.Panel, 'Horizontal', {}, this.getSet(), this.getSetHover(), this.getMenu(), this.getMenuHover())
			$(go.Panel, 'Horizontal', {}, this.getMenu(), this.getMenuHover())
		); // end output port
	}

	/**
	 * 分支节点操作菜单
	 * @param diagramEnum
	 */
	getSpotMenu(diagramEnum: DiagramEnum): go.Panel {
		return $(
			go.Panel,
			'Auto',
			{
				...spotCss,
				...{
					margin: new Margin(2, 10, 1, 0)
				},
				...{ name: 'action_Spot', width: 24, height: 24 }
			},
			$(go.Panel, 'Horizontal', {}, this.getMenu(), this.getMenuHover())
		);
	}

	private getMenu(): go.Panel {
		return $(
			go.Panel,
			'Horizontal',
			{
				...baseCss,
				...{
					name: 'node_Imenu',
					mouseEnter: this.onMenuMouseEnter
				}
			},
			$(go.Picture, IMenu, {
				alignment: go.Spot.Center,
				margin: new Margin(0, 6, 0, 6)
			})
		);
	}

	private getMenuHover(): go.Panel {
		return $(
			go.Panel,
			'Horizontal',
			{
				...baseCss,
				...hoverCss,
				...{
					name: 'node_Imenu_Hover',
					click: this.onMenuClick,
					mouseLeave: this.onMenuMouseLeave
				}
			},
			$(go.Picture, IMenuHover, {
				alignment: go.Spot.Center,
				margin: new Margin(0, 6, 0, 6)
			})
		);
	}

	private onMenuMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		this._showMenu(_obj, true, false);
	};

	private onMenuMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		this._showMenu(_obj, false, true);
	};

	private _showMenu = (_obj: GraphObject, showMouseEnter: boolean, showMouseLeave: boolean): void => {
		try {
			if (_obj) {
				const node = (_obj as any).part;
				if (node) {
					const set = node.findObject('node_Imenu');
					const setting = node.findObject('node_Imenu_Hover');
					if (set) {
						set.visible = showMouseLeave;
					}

					if (setting) {
						setting.visible = showMouseEnter;
					}
				}
			}
		} catch (e) {}
	};

	private onMenuClick = (e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(e, _obj, HandleEnum.ShowNodeMenu, this.callBack);
		// 上一步操作可能影响了显示效果，再执行一次选中
		this._showMenu(_obj, true, false);
	};

	/**
	 * 利用 节点 spot 实现靠右
	 * 循环列表信息
	 * @param DiagramEnum
	 */
	getSpotLoopInfo(): go.Panel {
		// 节点基本样式
		const spotCss = {
			alignment: go.Spot.TopRight,
			cursor: 'pointer',
			height: 26,
			width: 25,
			margin: new Margin(0, 25, 0, 0)
		};
		// 图标基本样式
		const baseCss = {
			margin: new Margin(0, 0, 0, 0),
			visible: false,
			height: 26,
			width: 25
		};
		const hoverCss = {
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
						mouseEnter: this.onLoopInfoMouseEnter
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
						click: this.onLoopInfoClick,
						mouseLeave: this.onLoopInfoMouseLeave
					}
				},
				$(go.Picture, IListHover, {
					margin: new Margin(0, 6, 0, 6)
				})
			)
		);
	}
	/**
	 * 点击展示循环列表具体内容
	 */
	private onLoopInfoClick = async (_e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(_e, _obj, HandleEnum.ShowNodeInfo, this.callBack);
		this._showLoopInfo(_obj, true, false);
	};

	/**
	 *
	 */
	private onLoopInfoMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		this._showLoopInfo(_obj, true, false);
	};

	/**
	 *
	 */
	private onLoopInfoMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		this._showLoopInfo(_obj, false, true);
	};

	private _showLoopInfo = (_obj: GraphObject, showMouseEnter: boolean, showMouseLeave: boolean): void => {
		try {
			if (_obj) {
				const node = (_obj as any).part;
				if (node) {
					const set = node.findObject('node_Ilist');
					const setting = node.findObject('node_Ilist_Hover');
					if (set) {
						set.visible = showMouseLeave;
					}

					if (setting) {
						setting.visible = showMouseEnter;
					}
				}
			}
		} catch (e) {}
	};
}
