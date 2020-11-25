import go, { GraphObject } from 'gojs';
import { HandleEnum } from '../enum';
import { INodeEvent } from '../interface';
import BaseChanges from './baseChanges';

export default class Base {
	SwitchingLoopTerm: string = '切换循环选项'; //  lang.FlowchartDiagram.SwitchingLoopTerm
	OpenStepSet: string = '打开步骤设置，也可以双击步骤打开'; //  lang.FlowchartDiagram.OpenStepSet
	ForMoreMenus: string = '更多菜单，也可右键点击步骤'; // lang.FlowchartDiagram.ForMoreMenus
	static nodeEvent: INodeEvent;

	doFlowchartEvent(e: go.InputEvent, _obj: GraphObject, eType: HandleEnum, flowchartcallBack: Function) {
		if (_obj && flowchartcallBack) {
			const node: go.Part = (_obj as any).part;
			if (node && node.data) {
				const e: INodeEvent = {
					eType
				} as INodeEvent;
				//
				/** 打开点菜单 */
				switch (eType) {
					case HandleEnum.ShowNodeMenu:
					case HandleEnum.ShowNodeInfo:
					case HandleEnum.ShowLineMenu:
						if (node.diagram) {
							node.data._handleEnum = eType;
							node.diagram.commandHandler.showContextMenu(node.diagram);
						}
						break;
					default:
						e.node = node.data;
						flowchartcallBack(e);
						break;
				}
			}
		}
	}

	/**
	 * 处理 group 样式
	 * @param _targetObj
	 */
	doGroupCss_SelectionChanged = (_targetObj: any) => {
		/** 点击无效区域 */
		const node = (_targetObj as any).part;
		if (node && node.isSelected) {
			BaseChanges.setGroupCss(node, true);
		} else {
			BaseChanges.setGroupCss(node, false);
		}
	};
}
