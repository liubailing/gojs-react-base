import { observable } from 'mobx';
import { ILineModel } from '../../flowchart/interface';

/**
 * 工作流状态管理
 * 负责管理所有UI状态和业务状态
 */
export class WorkflowState {
	// 基础状态
	@observable taskId = '';
	@observable logs: string[] = [];
	@observable flowChartHasInited = false;

	// 节点操作状态
	@observable currentActionNodeKey = '';
	@observable currentActionLine: ILineModel | undefined = undefined;

	// 菜单状态
	@observable currentNodeMenuShowType = 0; // 0关闭 1添加节点 2点操作 3loopInfo
	@observable currentNodeMenuPosX = 0;
	@observable currentNodeMenuPosY = 0;
	@observable currentNodeMenuPosXOffset = 0;

	// UI状态
	@observable showNodeSetting = false;

	// 状态操作方法
	resetMenuState() {
		this.currentActionNodeKey = '';
		this.currentNodeMenuPosX = 0;
		this.currentNodeMenuPosY = 0;
		this.currentNodeMenuShowType = 0;
		this.currentNodeMenuPosXOffset = 0;
	}

	setMenuState(nodeKey: string, posX: number, posY: number, showType: number) {
		this.currentActionNodeKey = nodeKey;
		this.currentNodeMenuPosX = posX;
		this.currentNodeMenuPosY = posY;
		this.currentNodeMenuShowType = showType;
	}

	addLog(message: string) {
		this.logs.push(message);
	}

	clearLogs() {
		this.logs = [];
	}
}
