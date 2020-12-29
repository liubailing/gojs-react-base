import { DiagramEnum, NodeEnum } from '../enum';
import { FlowchartModel } from '../model';
/**
 * 图形节点属性
 */
export interface INodeModel {
	/** 唯一标识ID */
	key: string;

	/** 步骤名称 */
	label: string;

	/** 所在分组 */
	group: string;

	/** 节点  类型  FCNodeEnmu */
	type: string | NodeEnum;

	/** 是否是组 */
	isGroup: boolean;

	/***********************
	 * 以下非必要属性属性
	 **********************/

	childs: FlowchartModel | null;

	/** 排序 */
	sortIndex?: number;

	/** 图形分类
	 * 对应 FCcategory
	 * FCNode | LoopGroup | ConditionGroup | Condition | Start | End
	 * */
	category?: string | DiagramEnum;
}
