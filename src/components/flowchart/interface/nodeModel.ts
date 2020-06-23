import { DiagramEnum, NodeEnum } from '../enum';
/**
 * 图形节点属性
 */
export type NodeModel = {
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

	/** 是否选中 */
	isSel?: boolean;

	/***********************
	 * 以下属性不用管
	 **********************/

	/** 是否有子步骤    当 isGroup == true ,必须给 hasChild赋值 */
	hasChild?: boolean;

	/** 对应的配置属性  交互使用的数据 */
	data?: any;

	/** 图形分类
	 * 对应 FCDiagramType
	 * FCNode | LoopGroup | ConditionGroup | Condition | Start | End
	 * */
	diagramType?: string | DiagramEnum;

	/** 透明度 */
	opacity?: number /**  */;

	/** 排序 */
	sortIndex?: number;

	/** 节点  类型  FCNodeEnum */
	category?: string | DiagramEnum;
};
