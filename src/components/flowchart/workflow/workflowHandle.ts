import { IFlowchartHander } from '../interface';
import { HanderFlowchart } from '../handle';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export class WorkflowHandle implements IFlowchartHander {
	constructor() {}

	flowchart: HanderFlowchart = new HanderFlowchart(this);

	handlerClickNode(): void {
		console.log('---handlerClickNode');
	}
	handlerAddNode(): void {
		console.log('---handlerAddNode');
	}
	handlerDeleteNode(): void {
		console.log('---handlerDeleteNode');
	}
}

const w = new WorkflowHandle();
export default w;
