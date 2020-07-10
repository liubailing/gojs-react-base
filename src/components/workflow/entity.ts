/**
 * 工作流上 激活的节点
 */
export class ActionNode {
	key: string = '';
	type: string = '';
	label?: string = '';
	parentKey?: string = ''; //父节点
	childKeys?: string[] = [];
	data?: any = {}; // 当前节点的数据
	parent?: ActionNode | undefined = undefined; //父节点
	childs?: ActionNode[] = [];
}

/**
 * 操作节点类型
 */
export enum ActionNodeType {
	Condition = 'ConditionAction',
	Branch = 'BranchAction',
	ExtractData = 'ExtractDataAction',
	Click = 'ClickAction',
	EnterCapacha = 'EnterCapachaAction',
	EnterText = 'EnterTextAction',
	Loop = 'LoopAction',
	MouseOver = 'MouseOverAction',
	Navigate = 'NavigateAction',
	SwitchCombo = 'SwitchCombo2Action'
}
