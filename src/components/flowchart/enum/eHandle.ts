/**
 * Node 相关操作类型
 */
export enum HandleEnum {
	/** 显示 线 的菜单 */
	ShowLineMenu = 'Show_Line_Menu',
	/** 显示 点 的菜单 */
	ShowNodeMenu = 'Show_Node_Enmu',
	/** 显示 点 的信息 */
	ShowNodeInfo = 'Show_Node_Info',
	/** 显示 点 的设置 */
	ShowNodeSetting = 'Show_Setting',
	/** 隐藏context */
	HideContextMenu = 'Hide_Context',

	DragNode2Link = 'dragNode_to_link',

	AddBranchToLeft = 'addBranch_to_before',
	AddBranchToRight = 'addBranch_to_after',

	AddNodeToBefore = 'addNode_to_before',
	AddNodeToAfter = 'addNode_to_after'
}
