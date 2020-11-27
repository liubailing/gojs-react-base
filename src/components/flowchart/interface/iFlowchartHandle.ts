/* eslint-disable @typescript-eslint/method-signature-style */
// import go from 'gojs';
import { INodeModel } from './iNodeModel';
import { ILineModel } from './iLineModel';

export interface IFlowchartHander {
	/******************************
	 *
	 ******************************/

	/**
	 * 点击信息
	 * @param node 节点数据
	 */
	handlerClickNode(node: INodeModel, isManual?: boolean): void;

	/**
	 * 节点增加后 触发事件
	 */
	handlerAddNode(node: INodeModel): void;

	/**
	 * 流程改变后 触发事件
	 */
	handlerChanged(): void;

	/**
	 * 显示点-设置面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeSetting(node: INodeModel, posX: number, posY: number): void;

	/**
	 * 显示点-菜单面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeMenu(node: INodeModel, posX: number, posY: number): void;

	/** 隐藏菜单面板 */
	handlerHideNodeMenu(): void;

	/**
	 * 显示点-信息面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeInfo(node: INodeModel, posX: number, posY: number): void;

	/** 隐藏信息面板 */
	handlerHideNodeInfo(): void;

	/**
	 * 显示点-菜单面板
	 * @param line 线信息
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowLineMenu(line: ILineModel, posX: number, posY: number): void;

	/** 隐藏线面板 */
	handlerHideLineMenu(): void;

	/** 隐藏 右键菜单 */
	handlerHideContextMenu(): void;
}
