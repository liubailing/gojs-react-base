import { DiagramEnum } from '../enum';

/**
 * 连线对应的属性
 */
export interface ILineModel {
	/** 所在分组 */
	key: string;

	/** 连线起始点 */
	from: string;

	/** 连线结束点 */
	to: string;
}
