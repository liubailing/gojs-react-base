/* eslint-disable camelcase */
import go from 'gojs';
import { BaseColors, HoverColors } from '../config';

export default class baseChanges {
	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setGroupCss(node: go.Part, isShow: boolean) {
		const group_main = node.findObject('group_main');
		const group_Top = node.findObject('group_Top');
		const group_Title = node.findObject('group_Title');
		const listHover = node.findObject('node_Ilist_Hover');
		const list = node.findObject('node_Ilist');

		node.opacity = 1;
		if (isShow) {
			if (group_main) {
				(group_main as any).fill = HoverColors.group_bg;
				(group_main as any).stroke = HoverColors.group_bg;
			}
			if (group_Top) {
				group_Top.background = HoverColors.group_bg;
			}
			if (group_Title) {
				(group_Title as any).stroke = HoverColors.group_font;
			}
			if (list) {
				list.visible = true;
			}
		} else {
			if (group_main) {
				(group_main as any).fill = BaseColors.transparent;
				(group_main as any).stroke = BaseColors.group_bg;
			}

			if (group_Top) {
				group_Top.background = BaseColors.group_bg;
			}
			if (group_Title) {
				(group_Title as any).stroke = BaseColors.group_font;
			}
			if (list) {
				list.visible = false;
			}
			if (listHover) {
				listHover.visible = false;
			}
		}

		this.setActionCss(node, isShow);
	}

	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setActionCss(node: go.Part, isShow: boolean) {
		const node_Iset = node.findObject('node_Iset');
		const node_Imenu = node.findObject('node_Imenu');
		const node_Iset_Hover = node.findObject('node_Iset_Hover');
		const node_Imenu_Hover = node.findObject('node_Imenu_Hover');

		if (isShow) {
			if (node_Iset) {
				node_Iset.visible = true;
			}
			if (node_Imenu) {
				node_Imenu.visible = true;
			}
			if (node_Iset_Hover) {
				node_Iset_Hover.visible = false;
			}
			if (node_Imenu_Hover) {
				node_Imenu_Hover.visible = false;
			}
		} else {
			if (node_Iset) {
				node_Iset.visible = false;
			}
			if (node_Imenu) {
				node_Imenu.visible = false;
			}
			if (node_Iset_Hover) {
				node_Iset_Hover.visible = false;
			}
			if (node_Imenu_Hover) {
				node_Imenu_Hover.visible = false;
			}
		}
	}

	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setListCss(node: go.Part, isShow: boolean) {
		const node_Ilist = node.findObject('node_Ilist');
		const node_Ilist_Hover = node.findObject('node_Ilist_Hover');

		if (isShow) {
			if (node_Ilist) {
				node_Ilist.visible = true;
			}

			if (node_Ilist_Hover) {
				node_Ilist_Hover.visible = false;
			}
		} else {
			if (node_Ilist) {
				node_Ilist.visible = false;
			}

			if (node_Ilist_Hover) {
				node_Ilist_Hover.visible = false;
			}
		}
	}

	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setNodeCss(node: go.Part, isShow: boolean) {
		const node_Body = node.findObject('node_Body');
		node.opacity = 1;
		if (isShow) {
			if (node_Body) {
				(node_Body as any).fill = BaseColors.highlight;
			}
		} else {
			if (node_Body) {
				(node_Body as any).fill = BaseColors.backgroud;
			}
		}
	}

	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setBranchCss(node: go.Part, isShow: boolean) {
		const left_Spot = node.findObject('left_Spot');
		const right_Spot = node.findObject('right_Spot');

		if (isShow) {
			if (left_Spot) {
				left_Spot.opacity = 1;
			}
			if (right_Spot) {
				right_Spot.opacity = 1;
			}
		} else {
			if (left_Spot) {
				left_Spot.opacity = 0;
			}
			if (right_Spot) {
				right_Spot.opacity = 0;
			}
		}
	}

	static setLinkCss(node: go.Part, isShow: boolean) {
		if (!node) {
			return;
		}
		const link_Body = node.findObject('link_Body') as any;
		const link_Arr = node.findObject('link_Arr') as any;
		const link_Hover = node.findObject('link_Hover');
		const link_Add = node.findObject('link_Add');
		if (isShow) {
			if (link_Body) {
				link_Body.stroke = HoverColors.link;
			}
			if (link_Arr) {
				link_Arr.fill = HoverColors.link;
			}
			if (link_Hover) {
				link_Hover.visible = true;
			}
			if (link_Add) {
				link_Add.visible = true;
			}
		} else {
			if (link_Body) {
				link_Body.stroke = BaseColors.link;
			}
			if (link_Arr) {
				link_Arr.fill = BaseColors.link;
			}
			if (link_Hover) {
				link_Hover.visible = false;
			}
			if (link_Add) {
				link_Add.visible = false;
			}
		}
	}
}
