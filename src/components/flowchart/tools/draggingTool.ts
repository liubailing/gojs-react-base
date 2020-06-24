import * as go from 'gojs';
import { HandleEnum, DiagramEnum } from '../enum';
import { INodeEvent } from '../interface';
// import baseChanges from '../draw/baseChanges';

export default class DraggingTool extends go.DraggingTool {
	private _imagePart: go.Part | null = null;
	private _ghostDraggedParts: go.Map<go.Part, go.DraggingInfo> | null = null;
	private _originalDraggedParts: go.Map<go.Part, go.DraggingInfo> | null = null;
	private _doDragEvent: Function;

	constructor(_doDragEvent: Function) {
		super();
		this._doDragEvent = _doDragEvent;
	}
	/**
	 * Call the base method, and then make an image of the returned collection,
	 * show it using a Picture, and hold the Picture in a temporary Part, as _imagePart.
	 * @param {Iterable.<Part>} parts A {@link Set} or {@link List} of {@link Part}s.
	 * @return {Map.<Part,DraggingInfo>}
	 */
	public computeEffectiveCollection(coll: go.Iterable<go.Part>): go.Map<go.Part, go.DraggingInfo> {
		const map = super.computeEffectiveCollection(coll, this.dragOptions);
		if (this.isActive && this._imagePart === null) {
			const bounds = this.diagram.computePartsBounds(map.toKeySet());
			const offset = this.diagram.lastInput.documentPoint.copy().subtract(bounds.position);
			const $ = go.GraphObject.make;
			this._imagePart = $(
				go.Part,
				{
					layerName: 'Tool',
					opacity: 0.5,
					locationSpot: new go.Spot(0, 0, offset.x, offset.y)
				},
				$(go.Picture, {
					element: this.diagram.makeImage({ parts: map.toKeySet() })
				})
			);
		}
		return map;
	}

	/**
	 * When activated, replace the {@link #draggedParts} with the ghost dragged parts, which
	 * consists of just one Part, the image, added to the Diagram at the current mouse point.
	 */
	public doActivate(): void {
		//console.log(`~test flowchart~  doActivate`, this.diagram.scroll("pixel", "down", 11))
		super.doActivate();
		if (this._imagePart !== null) {
			this._imagePart.location = this.diagram.lastInput.documentPoint;
			this.diagram.add(this._imagePart);
			this._originalDraggedParts = this.draggedParts;
			this._ghostDraggedParts = super.computeEffectiveCollection(
				new go.List<go.Part>().add(this._imagePart),
				this.dragOptions
			);
			this.draggedParts = this._ghostDraggedParts;
		}
		// if (this._doDragEvent) this._doDragEvent();
	}

	/**
	 * When deactivated, make sure any image is removed from the Diagram and all references are cleared out.
	 */
	public doDeactivate(): void {
		// console.log(`~test flowchart~  doDeactivate`);
		if (this._imagePart !== null) {
			this.diagram.remove(this._imagePart);
		}

		this._imagePart = null;
		this._ghostDraggedParts = null;
		this._originalDraggedParts = null;

		let dragNode = null,
			dragToNode = null,
			candrag = true;
		if (this.currentPart && this.currentPart.part && this.currentPart.part.data)
			dragNode = this.currentPart.part.data;
		let node = this.diagram.findPartAt(this.diagram.lastInput.documentPoint);
		if (node && node.part && node.part.data) dragToNode = node.part.data;
		if (dragNode.category === DiagramEnum.ConditionSwitch) candrag = false;

		/**
		 * 不能往子集里面拖动
		 */
		if (candrag && this.currentPart instanceof go.Group) {
			let objs = this.currentPart.findSubGraphParts();
			if (objs && objs.size > 0 && node && objs.has(node)) candrag = false;
			// if (node) baseChanges.setLinkCss(node, false);
		}

		// 判断为线
		if (dragToNode && dragToNode.from !== undefined && dragToNode.from) {
			if (dragToNode.from === dragNode.key || dragToNode.to === dragNode.key) candrag = false;
			/**
			 * 触发拖拽
			 */
			if (dragNode && dragToNode && candrag) {
				let e: INodeEvent = {
					eType: HandleEnum.DragNode2Link,
					node: dragNode,
					toLine: dragToNode
				} as INodeEvent;
				this._doDragEvent(e);
			}
		}

		super.doDeactivate();
	}

	/**
	 * Do the normal mouse-up behavior, but only after restoring {@link #draggedParts}.
	 */
	public doMouseUp(): void {
		if (this._originalDraggedParts !== null) {
			this.draggedParts = this._originalDraggedParts;
		}
		super.doMouseUp();
	}

	/**
	 * If the user changes to "copying" mode by holding down the Control key,
	 * return to the regular behavior and remove the image.
	 */
	public doKeyDown(): void {
		if (
			this._imagePart !== null &&
			this._originalDraggedParts !== null &&
			(this.diagram.lastInput.control || this.diagram.lastInput.meta) &&
			this.mayCopy()
		) {
			this.draggedParts = this._originalDraggedParts;
			this.diagram.remove(this._imagePart);
		}

		super.doKeyDown();
	}

	/**
	 * If the user changes back to "moving" mode,
	 * show the image again and go back to dragging the ghost dragged parts.
	 */
	public doKeyUp(): void {
		if (this._imagePart !== null && this._ghostDraggedParts !== null && this.mayMove()) {
			this._imagePart.location = this.diagram.lastInput.documentPoint;
			this.diagram.add(this._imagePart);
			this.draggedParts = this._ghostDraggedParts;
		}
		super.doKeyUp();
	}

	/**
	 * If the user changes back to "moving" mode,
	 * show the image again and go back to dragging the ghost dragged parts.
	 */
	public doMouseMove(): void {
		// console.log(`~test flowchart:doMouseMove~****`);
		if (this.diagram.div) {
			if (this.diagram.div.clientHeight < this.diagram.lastInput.viewPoint.y + 100) {
				this.diagram.scroll('pixel', 'down', 10);
			}

			if (this.diagram.lastInput.viewPoint.y < 100) {
				this.diagram.scroll('pixel', 'up', 10);
			}

			if (this.diagram.div.clientWidth < this.diagram.lastInput.viewPoint.x + 100) {
				this.diagram.scroll('pixel', 'right', 20);
			}

			if (this.diagram.lastInput.viewPoint.x < 100) {
				this.diagram.scroll('pixel', 'left', 20);
			}
		}
		super.doMouseMove();
	}

	doDragOver(pt: go.Point, obj: go.GraphObject | null) {
		// console.log(`~test flowchart~  1`);
		super.doDragOver(pt, obj);
	}
}
