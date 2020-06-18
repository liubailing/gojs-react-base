import go from 'gojs';
import { BaseColors, HoverColors } from '../config';

export default class baseChanges {
	/**
	 * 修改样式
	 * @param node 节点
	 * @param isShow 是否显示
	 */
	static setSpotCss(node: go.Part, isShow: boolean) {
		const group_main = node.findObject('group_main');
		const group_Top = node.findObject('group_Top');
		const group_Title = node.findObject('group_Title');
		let node_Iset = node.findObject('node_Iset');
		let node_Imenu = node.findObject('node_Imenu');
		let node_Iset_Hover = node.findObject('node_Iset_Hover');
		let node_Imenu_Hover = node.findObject('node_Imenu_Hover');

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
		let node_Ilist = node.findObject('node_Ilist');
		let node_Ilist_Hover = node.findObject('node_Ilist_Hover');

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
		let node_Body = node.findObject('node_Body');

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
}
