import { LineModel } from './iLineModel';
import { NodeModel } from './iNodeModel';
import { HandleEnum } from '../enum';

/**
 * node 操作事件-相关参数
 */
export interface NodeEvent {
	/** 监听的事件类型 */
	eType: HandleEnum;
	/** 当前点 */
	node?: NodeModel;
	/** 当前点 */
	line?: LineModel;
	/** 操作目标线 */
	toLine?: LineModel;
	/** 操作目标点 */
	toNode?: NodeModel;

	/** 操作目标点 */
	// toObj?: LineModel | NodeModel;
	// /** 当前 X 坐标 */
	// posX?: number;
	// /** 当前 Y 坐标 */
	// posY?: number;
}
