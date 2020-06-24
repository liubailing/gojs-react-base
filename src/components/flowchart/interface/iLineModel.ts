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

	/** 所在分组 */
	// group: string;

	/**************************
	 * 以下属性不用管
	 **************************/

	/**
	 * 图形分类
	 * 对应 DiagramEnum  WFLink | WFGuideLink
	 * */
	// category?: DiagramEnum;

	/**
	 * 分类
	 * */
	// category: string;

	// /**
	//  * 分类
	//  * */
	// opacity?: 0 | 1;
}
