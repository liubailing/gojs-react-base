/**
 * 图形分类
 */
export enum DiagramEnum {
	/** 节点 */
	FCNode = 'FCNode',

	/** 线 */
	WFLink = 'WFLink',

	/** 循环分组 */
	LoopGroup = 'LoopGroup',

	/** 条件组 */
	ConditionGroup = 'ConditionGroup',

	/** 条件 */
	ConditionSwitch = 'ConditionSwitch',

	/** 起始 */
	WFGuideStart = 'WFGuide_Start',

	/** 结束 */
	WFGuideEnd = 'WFGuide_End',

	/** 开启(循坏分支，条件分支) */
	WFGuideSubOpen = 'WFGuide_SubOpen',

	/** 关闭(循坏分支，条件分支) */
	WFGuideSubClose = 'WFGuide_SubClose',
	/** 辅助线 */
	WFGuideLink = 'WFGuideLink',

	/** 辅助点  支线流程的起始节点 */
	WFGuideNode = 'WFGuideNode',

	/** 结束循环，结束流程 */
	StopLoopOrFlow = 'StopLoopOrFlow'
}
