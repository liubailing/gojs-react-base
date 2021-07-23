import * as go from '@octopus/gojs';

export default class ContextMenuTool extends go.ContextMenuTool {
	private _doDragEvent: Function;
	private _show: boolean = false;
	constructor(_doDragEvent: Function) {
		super();
		this._doDragEvent = _doDragEvent;
	}

	doMouseDown(): void {}

	showContextMenu(contextmenu: go.Adornment | go.HTMLInfo, obj: go.GraphObject | null) {
		super.showContextMenu(contextmenu, null);
	}

	positionContextMenu(contextmenu: go.Adornment, obj: go.GraphObject | null): void {
		// let pos = this.diagram.lastInput.documentPoint.copy();
		// let node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		// let node: go.Part = this.diagram.lastInput as go.Part;
		// super.positionContextMenu(node.getDocumentPoint(go.Spot.Center), null);
	}
	hideContextMenu(): void {
		super.hideContextMenu();
	}
}
