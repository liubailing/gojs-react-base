import go, { GraphObject } from '@octopus/gojs';
import { HandleEnum } from '../enum';
import { INodeEvent, ILineModel, INodeModel } from '../interface';
import BaseChanges from './baseChanges';

export default class Base {
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
							// node.data._handleEnum = eType;
							// node.diagram.commandHandler.showContextMenu(node.diagram);
							// node.diagram.currentTool.doCancel();
							this.showInfo(eType, node, flowchartcallBack);
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
		this.selectNode(_targetObj);
	};

	/**
	 * 处理 group branch 样式
	 * @param _targetObj
	 */
	doBranchCss_SelectionChanged(_targetObj: any){
		this.selectNode(_targetObj);
	}

	
	private selectNode(_targetObj: any){
		/** 点击无效区域 */
		const node = (_targetObj as any).part;
		if (node && node.isSelected) {
			BaseChanges.setGroupSelectedCss(node, true);
		} else {
			BaseChanges.setGroupCss(node, false);
		}
	}


	private showInfo(eType: HandleEnum, currNode: any, flowchartcallBack: any) {
		const node = currNode.diagram.findPartAt(currNode.diagram.lastInput.documentPoint);
		if (node) {
			// const eType: HandleEnum = node.data._handleEnum || HandleEnum.ShowNodeMenu;
			const e: INodeEvent = {
				eType
			} as INodeEvent;

			if (eType === HandleEnum.ShowLineMenu) {
				e.line = node.data as ILineModel;
			} else {
				e.node = node.data as INodeModel;
			}

			flowchartcallBack(e);
		}
	}
}
