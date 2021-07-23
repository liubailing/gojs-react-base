import go, { Diagram } from '@octopus/gojs';
import { HandleEnum } from '../enum';
import Base from './base';
import { INodeEvent, ILineModel, INodeModel } from '../interface';
const $ = go.GraphObject.make;

export default class DrawContextMenu extends Base {
	callBack: Function;
	contextMenuDIV: HTMLElement | null;
	diagram: Diagram;
	constructor(diagram: Diagram, e: Function) {
		super();
		this.callBack = e;
		this.contextMenuDIV = null;
		this.diagram = diagram;
	}

	getContextMenu(): go.HTMLInfo {
		return $(go.HTMLInfo, {
			show: this.showContextMenu,
			hide: this.hideContextMenu
		});
	}

	// contextmenu: Adornment | HTMLInfo, obj: GraphObject | null
	showContextMenu = () => {
		const node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		if (node) {
			const eType: HandleEnum = node.data._handleEnum || HandleEnum.ShowNodeMenu;
			const e: INodeEvent = {
				eType
			} as INodeEvent;

			if (eType === HandleEnum.ShowLineMenu) {
				e.line = node.data as ILineModel;
			} else {
				e.node = node.data as INodeModel;
			}


			delete node.data._handleEnum;
			this.callBack(e);
			// this.toolManager.contextMenuTool.hideContextMenu();
		}

	};

	hideContextMenu = () => {
		const handle: INodeEvent = {
			eType: HandleEnum.HideContextMenu
		} as INodeEvent;
		this.callBack(handle);
	};
}
