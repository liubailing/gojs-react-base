import HanderFlowchart from './flowchartLinked';

export { HanderFlowchart };

/**
 * 工作流程对外事件接口, 外部想要捕捉事件必须实现以下方法
 */
export interface IFlowChartStore {
	/**
	 * 流程图对外回调接口，
	 * 点击节点后将会触发的操作
	 * @param current
	 */
	onClickNodeHandler: (current: any, isManual?: boolean) => void;

	/**
	 * 流程图对外回调接口，
	 * 删除节点
	 */
	onDeleteNodeHandler: (currKey: string, deleteKey: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 新增节点节点
	 */
	onAddNodeHandler: (currNode: any, isDrag: boolean) => void;

	/**
	 * 流程图对外回调接口，
	 * 显示节点编辑页面
	 */
	onShowEditPage: () => void;

	/**
	 * 流程图对外回调接口，
	 * 修改名称
	 */
	onEditNodeName: (currName: string, currNodeKey: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 这个只是通知流程图已经改变。具体的改变不。
	 *  拖拽（成功），删除节点，复制，删除， 新增节点
	 */
	onChangedHandler: (currKey: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 复制成功后触发
	 */
	onPasteHandler: (currKey: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 对外触发提示
	 */
	onCopyHandler: (mapData?: Map<string, string>) => void;

	/**
	 * 流程图对外回调接口，
	 * 复制成功后触发
	 */
	onDragHandler: (current: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 对外触发提示
	 */
	onTipHandler: (tips: string) => void;

	/**
	 * 流程图对外回调接口，
	 * 第一次构建完成
	 */
	onInitHandler: () => void;

	/**
	 * 流程图对外回调接口，
	 * hover流程图节点显示流程图信息
	 */
	onNodeInfoHandler: (nodeData: any) => Promise<Array<any>>;

	/**
	 * 流程图对外回调接口，
	 * 获取当前节点的信息
	 */
	onNodeDataHandler: (nodeData: any) => Promise<any>;

	/**
	 * 流程图对外回调接口，
	 * 选择循环列表的循环项
	 */
	onLoopInfoHandler: (nodeData: any, value: any, option: any) => Promise<void>;

	/**
	 * 流程图对外回调接口，
	 * 保存流程图名字
	 */
	onSaveNodeNameHandler: (name: string) => void;
}
