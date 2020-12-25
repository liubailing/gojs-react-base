/**
 * Node 相关操作类型
 */
export enum HandleEnum {
	/** 显示 线 的菜单 */
	ShowLineMenu = 'Show_Line_Menu',
	/** 显示 点 的菜单 */
	ShowNodeMenu = 'Show_Node_Menu',
	/** 显示 点 的菜单 */
	ShowNodeMContextMenu = 'Show_Node_ContextMenu',
	/** 显示 点 的信息 */
	ShowNodeInfo = 'Show_Node_Info',
	/** 显示 点 的设置 */
	ShowNodeSetting = 'Show_Setting',
	/** 隐藏context */
	HideContextMenu = 'Hide_Context',
	/** 拖动 */
	DragNode2Link = 'dragNode_to_link',
	/** 删除 */
	DeleteNode = 'delete_Node',
	/** 复制 */
	CopyNode = 'copy_Node',
	/** 复制到黏贴 */
	Copy2PasteNode = 'copy_paste_Node',
	/** 剪切 */
	CutNode = 'cut_Node',
	/** 剪切到黏贴 */
	Cut2PasteNode = 'cut_paste_Node',
	/** 黏贴 */
	PasteNode = 'paste_Node',
	/** 修改节点名称 */
	RenameNode = 'rename_Node',

	Init = 'init',
	ReRender = 'rerender',

	AddBranchToLeft = 'addBranch_to_before',
	AddBranchToRight = 'addBranch_to_after',

	AddNodeToBefore = 'addNode_to_before',
	AddNodeToAfter = 'addNode_to_after'
}
