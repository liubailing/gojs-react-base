/**
 * 操作节点类型
 */
export enum NodeEnum {
	//点击元素
	Click = 'ClickAction',

	//提取数据
	ExtractData = 'ExtractDataAction',

	//循环
	Loop = 'LoopAction',

	//判断条件
	Condition = 'ConditionAction',

	//打开网页
	Navigate = 'NavigateAction',

	//输入文字
	EnterText = 'EnterTextAction',

	//识别验证码
	EnterCapacha = 'EnterCapachaAction',

	//切换下拉选项
	SwitchCombo = 'SwitchCombo2Action',

	//移动鼠标到元素上
	MouseOver = 'MouseOverAction',

	//结束循环
	BreakActivity = 'BreakActivity',

	//某个流程结束
	Complete = 'CompleteWF',

	/**
	 * 起始
	 */
	Start = 'start',
	/**
	 * 结束
	 */
	End = 'end',

	/**
	 * 判断条件 分支
	 */
	Branch = 'BranchAction',

	/**
	 * 开启(循坏分支，条件分支)
	 */
	SubOpen = 'WFGuide_SubBegin',

	/**
	 *关闭(循坏分支，条件分支)
	 */
	SubClose = 'WFGuide_SubEnd',

	/**
	 * 辅助点, 某个流程 仅在构图时候使用
	 */
	WFGuideNode = 'wfgridenode'
}
