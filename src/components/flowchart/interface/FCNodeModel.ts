import {FCDiagramEnum} from '../enum'
/**
 * 图形节点属性
 */
export type FCNodeModel = {
	key: string; //唯一标识ID

	label: string; //步骤名称
	group: string; // 所在分组
	type: string; // 节点  类型  FCNodeType
	isGroup: boolean; // 是否是组

	// hasChild?: boolean; // 是否有子步骤    当 isGroup == true ,必须给 hasChild赋值
	// data?: any; // 对应的配置属性  交互使用的数据

	//以下属性不用管
	diagramType?: FCDiagramEnum; // 图形分类      对应 FCDiagramType     FCNode | LoopGroup | ConditionGroup | Condition | Start | End
	opacity?: number; //
	sortIndex?: number;
	category?: string; // 节点  类型  FCNodeType
}
