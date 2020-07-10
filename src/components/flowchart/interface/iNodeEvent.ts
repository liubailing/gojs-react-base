import { ILineModel } from './iLineModel';
import { INodeModel } from './iNodeModel';
import { HandleEnum } from '../enum';

/**
 * node 操作事件-相关参数
 */
export interface INodeEvent {
	/** 监听的事件类型 */
	eType: HandleEnum;
	/** 当前点 */
	node?: INodeModel;
	/** 当前点 */
	line?: ILineModel;
	/** 操作目标线 */
	toLine?: ILineModel;
	/** 操作目标点 */
	toNode?: INodeModel;
}
