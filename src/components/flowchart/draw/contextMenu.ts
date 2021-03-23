import go, { Diagram } from 'gojs';
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

			// let offset = this.diagram.lastInput.viewPoint;
			// let offset = node.getDocumentPoint(go.Spot.BottomCenter);
			// if (offset) {
			// 	e.posX = offset?.x;
			// 	e.posY = offset?.y;
			// }

			delete node.data._handleEnum;
			this.callBack(e);
			// this.toolManager.contextMenuTool.hideContextMenu();
		}

		// if (node && node.part && node.part.data) {
		// this._show = true;
		// let offsetN = node.getDocumentPoint(go.Spot.TopRight);
		// let offset = node.getRelativePoint(node.part, go.Spot.TopRight);
		// const objBounds = node.part.locationObject.getDocumentBounds();
		// const p0 = objBounds.x;
		// const p1 = objBounds.x + objBounds.width / 2;
		// const p2 = objBounds.x + objBounds.width;
		// console.log(`popopoo `, objBounds);
		// let offset = this.diagram.lastInput.viewPoint;
		// // let offset = this.diagram.position;
		// // console.log(`xxxxxx`, offsetN.x, offsetD.x);
		// // console.log(`yyyyyy`, offsetN.y, offsetD.y);
		// console.log(`yyyyyy`, offset);
		// this.contextMenuDIV = document.createElement('div');
		// this.contextMenuDIV.id = domId;
		// // Show only the relevant buttons given the current state.
		// let contextMen = document.getElementById('div-actions')?.cloneNode(true);
		// let offset1 = this.diagram;
		// let offset2 = this.diagram.layout;
		// console.log(`yyyyyy offset1`, offset1);
		// console.log(`yyyyyy offset2`, offset2);
		// if (contextMen) this.contextMenuDIV.appendChild(contextMen);
		// this.contextMenuDIV.style.left = offset.x - 10 + 'px'; //因为offsetLeft是只读属性所以要通过left属性设置。而且还要设置绝对定位。
		// this.contextMenuDIV.style.top = offset.y + 20 + 'px'; //
		// this.contextMenuDIV.style.left = objBounds.x + 'px'; //因为offsetLeft是只读属性所以要通过left属性设置。而且还要设置绝对定位。
		// this.contextMenuDIV.style.top = objBounds.y + 'px'; //
		// this.contextMenuDIV.style.display = 'block';
		// document.body.appendChild(this.contextMenuDIV);
		// this.callBack(HandleEnum.ShowLineMenu)
		// }
		//
	};

	hideContextMenu = () => {
		const handle: INodeEvent = {
			eType: HandleEnum.HideContextMenu
		} as INodeEvent;
		this.callBack(handle);
	};
}
