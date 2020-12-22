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
	 * 删除节点信息
	 * @param currKey 删除操作后选中的 nodekey
	 * @param deleteKey 已经删除的 nodekey
	 */
	handlerDeleteNode(currKey: string, deleteKey: string): void;

	/**
	 * 节点增加后 触发事件
	 */
	handlerAddNode(node: any | INodeModel, isDrag: boolean): void;

	/**
	 * 优化掉
	 * 流程图对外回调接口，
	 * 显示节点编辑页面
	 */
	onShowEditPage: () => void;

	/**
	 * 修改名称后的操作
	 */
	handlerSaveNodeName: (newName: string) => void;

	/**
	 * 流程改变后 触发事件
	 */
	handlerChanged(): void;

	/**
	 * 流程节点准备复制
	 * todo
	 */
	handlerWillCopy(): void;

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
	 */
	handlerGetNodeData(nodedata: any): void;

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
	 * 隐藏 右键菜单
	 * */
	handlerHideContextMenu(): void;
}
