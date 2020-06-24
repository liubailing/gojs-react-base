import go, { GraphObject } from 'gojs';
import { HandleEnum } from '../enum';
import { NodeEvent } from '../interface';
import BaseChanges from './baseChanges';

export default class Base {
	SwitchingLoopTerm: string = '切换循环选项'; //  lang.FlowchartDiagram.SwitchingLoopTerm
	OpenStepSet: string = '打开步骤设置，也可以双击步骤打开'; //  lang.FlowchartDiagram.OpenStepSet
	ForMoreMenus: string = '更多菜单，也可右键点击步骤'; //lang.FlowchartDiagram.ForMoreMenus
	static nodeEvent: NodeEvent;
	// onClick() {}

	doFlowchartEvent(e: go.InputEvent, _obj: GraphObject, eType: HandleEnum, flowchartcallBack: Function) {
		if (_obj && flowchartcallBack) {
			let node: go.Part = (_obj as any).part;
			// var p = node.location.copy();
			// // p.x += 200;
			// let loc = go.Point.stringify(p);
			// console.log('-----loc', loc, node.data.loc, node.getDocumentPoint(go.Spot.Center));
			// console.log('-----loc', loc, node.data.loc, node.getDocumentPoint(go.Spot.TopLeft));
			// console.log('-----loc', loc, node.data.loc, node.getDocumentPoint(go.Spot.TopRight));
			if (node && node.data) {
				let e: NodeEvent = {
					eType: eType
				} as NodeEvent;
				//
				switch (eType) {
					/** 打开点菜单 */
					case HandleEnum.ShowNodeMenu:
					case HandleEnum.ShowNodeInfo:
					// case HandleEnum.ShowNodeSetting:
					case HandleEnum.ShowNodeMenu:
					case HandleEnum.ShowLineMenu:
						// if (eType === HandleEnum.ShowLineMenu) {
						// 	e.line = node.data as LineModel;
						// } else {
						// 	e.node = node.data as NodeModel;
						// }

						// let offset = node.diagram?.lastInput.viewPoint;
						// if (offset) {
						// 	e.posX = offset?.x;
						// 	e.posY = offset?.y;
						// }

						if (node.diagram) {
							// flowchartcallBack(e);
							node.data._handleEnum = eType;
							node.diagram?.commandHandler.showContextMenu(node.diagram);
						}
						// flowchartcallBack(e);
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
		// }
	};
}
