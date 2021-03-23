/* eslint-disable @typescript-eslint/method-signature-style */
// import go from 'gojs';
import { INodeModel } from './iNodeModel';
import { ILineModel } from './iLineModel';

/**
 * 流程图回调接口
 */
export interface IFlowchartHander {
	/******************************
	 * 同步之前的老接口
	 ******************************/

	/**
	 * 点击信息
	 * @param node 节点数据
	 */
	handlerClickNode(node: any | INodeModel, isManual?: boolean): void;

	/**
	 * 重新点击在一个点上，但是不是双击
	 * @param node 节点数据
	 */
	handlerClickNodeAgain(node: any | INodeModel): void;

	/**
	 * 删除节点信息
	 * @param currKey 删除操作后选中的 nodekey
	 * @param deleteKey 已经删除的 nodekey
	 */
	handlerDeleteNode(currKey: string, deleteKey: string): void;

	/**
	 * 节点增加后 触发事件
	 */
	handlerAddNode(node: any | INodeModel): void;

	/**
	 * 优化掉
	 * 流程图对外回调接口，
	 * 显示节点编辑页面
	 */
	onShowEditPage: () => void;

	/**
	 * 修改名称后的操作
	 */
	handlerSaveNodeName: (key: string, newName: string) => void;

	/**
	 * 流程改变后 触发事件
	 */
	handlerChanged(): void;

	/**
	 * 流程黏贴
	 */
	handlerPaste(currNodeKey: string): void;

	/**
	 * 流程节点被拖拽
	 */
	handlerDrag(currNodeKey: string): void;

	/**
	 * 流程节操作相关提示
	 */
	handlerTip(tipType: string): void;

	/**
	 * 流程节初始化完成
	 */
	handlerInit(): void;

	/**
	 * 去显示流程节点
	 * todo 将弃用
	 */
	handlerHoverNodeInfo(nodedata: any): void;

	/**
	 * 获取完流程节点
	 * todo 将弃用 替代 handlerShowNodeInfo
	 */
	handlerShowLoopInfo(nodedata: any, value: any, option: any): void;

	/******************************
	 * 新增的对外接口
	 ******************************/

	/**
	 * 显示点-设置面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 * 暂时不用
	 */
	handlerShowNodeSetting(node: INodeModel, posX: number, posY: number): void;

	/**
	 * 显示点-菜单面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeMenu(node: INodeModel, posX: number, posY: number): void;

	/**
	 * 隐藏菜单面板
	 * */
	handlerHideNodeMenu(): void;

	/**
	 * 显示点-信息面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeInfo(node: INodeModel, posX: number, posY: number): void;

	/**
	 * 隐藏信息面板
	 */
	handlerHideNodeInfo(): void;

	/**
	 * 显示点-菜单面板
	 * @param line 线信息
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowLineMenu(line: ILineModel, posX: number, posY: number): void;

	/**
	 * 隐藏线面板
	 * */
	handlerHideLineMenu(): void;

	/**
	 * 隐藏 弹层信息
	 * */
	handlerHideModal(): void;

	/**
	 * 流程图失去焦点
	 */
	handlerLostFocus(): void;

	/**
	 * 流程图点击空白处
	 */
	handlerClickBackground(): void;

	/**
	 * 右键节点
	 */
	handlerRightClickNode(node: INodeModel, posX: number, posY: number): void;

	/**
	 * 流程图渲染变化
	 */
	handlerViewChanged(): void;

	/**
	 * 点击了出节点以外的对象，但是不包括背景
	 */
	handlerClickExcludeNode(): void;

	/**
	 * 鼠标移入
	 * 目前只有loop放开有这个事件
	 */
	handlerMouseEnter(node: INodeModel): void;
}
