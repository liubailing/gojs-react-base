import * as go from 'gojs';

export default class ClickSelectingTool extends go.ClickSelectingTool {
	constructor(_doDragEvent: any = null) {
		super();
	}

	
	/**
	 * This tool can run whenever a click occurs.
	 *
	 * This method may be overridden.
	 * Please read the Introduction page on <a href="../../intro/extensions.html">Extensions</a> for how to override methods and how to call this base method.
	 * @expose
	 * @return {boolean}
	 */
	canStart(): boolean {
		return true;
	}
	/**
	 * Upon a click, this calls Tool#standardMouseSelect to change the Diagram#selection collection,
	 * then calls Tool#standardMouseClick to perform the normal click behaviors,
	 * and then stops this tool.
	 */
	doMouseUp(): void {
		const { diagram } = this;
		// let node1 = this.diagram.findPartAt(this.diagram.firstInput.documentPoint);
		// if (node1 && node1.part && node1.part.data) console.log(`>>>>>>>>>1111`, node1);
		// alert(node1);
		// let node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		// if (node && node.part && node.part.data) console.log(`>>>>>>>>>`, node);

		super.doMouseUp();
	}
}
