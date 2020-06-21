import * as go from 'gojs';

export default class ContextMenuTool extends go.ContextMenuTool {
	private _doDragEvent: Function;
	private _show: boolean = false;
	constructor(_doDragEvent: Function) {
		super();
		this._doDragEvent = _doDragEvent;
	}

	doMouseDown(): void {
		console.log(`-------showContextMenu doMouseDown `);
	}

	showContextMenu(contextmenu: go.Adornment | go.HTMLInfo, obj: go.GraphObject | null) {
		// 如果没ID
		// if (!this._show) {
		// 	// return;
		// }
		// // console.log(`-------showContextMenu`);
		// let node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		// if (node && node.part && node.part.data && node.data._handleEnum) {
		// 	this._show = true;
		// } else {
		// 	this._show = false;
		// }
		// // 	// this._show = true;
		// // 	super.showContextMenu(contextmenu, null);
		// // 	return;
		// // }
		// // debugger;
		// if (this._show) {
		// 	super.showContextMenu(contextmenu, null);
		// } else {
		// 	this.hideContextMenu();
		// }
		// // delete node?.data?._handleEnum;
		super.showContextMenu(contextmenu, null);
	}

	positionContextMenu(contextmenu: go.Adornment, obj: go.GraphObject | null): void {
		// console.log(`-------positionContextMenu`);
		// //let pos = this.diagram.lastInput.documentPoint.copy();
		// let node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		// // let node: go.Part = this.diagram.lastInput as go.Part;
		// super.positionContextMenu(node.getDocumentPoint(go.Spot.Center), null);
	}
	hideContextMenu(): void {
		console.log(`-------hideContextMenu`);
		super.hideContextMenu();
	}
}
