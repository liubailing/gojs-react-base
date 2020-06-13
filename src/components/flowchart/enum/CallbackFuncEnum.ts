

/**
 * 流程图回调操作
 */
export enum CallbackFuncEnum {
	/**
	 * 初始化
	 */
	Init = 'Init',

	/**
	 * 点击节点后将会触发的操作
	 */
	Click = 'Click',

	/**
	 * 点击节点后将会触发的操作
	 */
	Select = 'Select',

	/**
	 * 删除节点
	 */
	Delete = 'Delete',

	/**
	 * 新增节点节点
	 */
	Add = 'Add',

	/**
	 * 结构发生变化
	 */
	Change = 'Change',

	/**
	 * 流程图发生成功拖拽
	 */
	Drag = 'Drag',

	/**
	 * 复制
	 */
	Copy = 'Copy',

	/**
	 * 黏贴
	 */
	Paste = 'Paste',

	/**
	 * 触发提示
	 */
	Tip = 'Tip'
}
