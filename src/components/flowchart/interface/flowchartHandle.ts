import go from 'gojs';

export interface IFlowchartHander {
	handlerClickNode(): void;
	handlerAddNode(): void;
	handlerDeleteNode(): void;
}
