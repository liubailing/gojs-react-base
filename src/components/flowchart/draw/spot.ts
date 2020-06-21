import go, { GraphObject, Margin } from 'gojs';
import { DiagramEnum } from '../enum';
import { NodeEvent } from '../interface';
import { HandleEnum } from '../enum';

import ISet from '../../../assets/flowchart/i-node-set.png';
import ISetHover from '../../../assets/flowchart/i-node-set-hover.png';
import IMenu from '../../../assets/flowchart/i-node-menu.png';
import IMenuHover from '../../../assets/flowchart/i-node-menu-hover.png';
import Base from './base';

const $ = go.GraphObject.make;

/** 节点基本样式 */
let spotCss = {
	alignment: go.Spot.TopRight,
	cursor: 'pointer',
	height: 26,
	width: 50
};
/** 图标基本样式 */
let baseCss = {
	margin: new Margin(0, 0, 0, 0),
	visible: false,
	// background: '#2b71ed',
	height: 26,
	width: 25
};
/** 图标基本样式 */
let hoverCss = {
	background: '#ffffff'
};

export default class DrawSpot extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}
	/**
	 *
	 * @param diagramEnum
	 */
	getSpot(diagramEnum: DiagramEnum): go.Panel {
		switch (diagramEnum) {
			case DiagramEnum.ConditionSwitch:
				spotCss = {
					...spotCss,
					...{
						margin: new Margin(1, 10, 0, 0)
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
			$(go.Panel, 'Horizontal', {}, this.getSet(), this.getSetHover(), this.getMenu(), this.getMenuHover())
		); // end output port
	}

	/**
	 *
	 * @param diagramEnum
	 */
	getSpotMenu(diagramEnum: DiagramEnum): go.Panel {
		return $(
			go.Panel,
			'Auto',
			{
				...spotCss,
				...{ name: 'action_Spot', width: 25 }
			},
			$(go.Panel, 'Horizontal', {}, this.getMenu(), this.getMenuHover())
		);
	}

	private getSet(): go.Panel {
		return $(
			go.Panel,
			'Horizontal',
			{
				...baseCss,
				...{
					name: 'node_Iset',
					mouseEnter: this.onSetMouseEnter
				}
			},
			$(go.Picture, ISet, {
				alignment: go.Spot.Center,
				margin: new Margin(0, 6, 0, 6)
			})
		);
	}

	private getSetHover(): go.Panel {
		return $(
			go.Panel,
			'Horizontal',
			{
				...baseCss,
				...hoverCss,
				...{
					name: 'node_Iset_Hover',
					click: this.onSettingClick,
					mouseLeave: this.onSetMouseLeave
				}
			},
			$(go.Picture, ISetHover, {
				alignment: go.Spot.Center,
				margin: new Margin(0, 6, 0, 6)
			})
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
					// click: function (e, shape) {
					// 	e.diagram.commandHandler.showContextMenu();
					// },
					mouseLeave: this.onMenuMouseLeave
				}
			},
			$(go.Picture, IMenuHover, {
				alignment: go.Spot.Center,
				margin: new Margin(0, 6, 0, 6)
			})
		);
	}

	private onSetMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = false;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = true;
				}
			}
		} catch (e) {}
	};

	private onSetMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = true;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	private onMenuMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Imenu');
					if (set) set.visible = false;
					let setting = node.findObject('node_Imenu_Hover');
					if (setting) setting.visible = true;
				}
			}
		} catch (e) {}
	};

	private onMenuMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Imenu');
					if (set) set.visible = true;
					let setting = node.findObject('node_Imenu_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	private onMenuClick = (e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(e, _obj, HandleEnum.ShowNodeMenu, this.callBack);
	};

	private onSettingClick = (e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(e, _obj, HandleEnum.ShowNodeSetting, this.callBack);
	};
}
