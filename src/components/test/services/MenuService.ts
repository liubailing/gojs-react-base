import { INodeModel, ILineModel } from '../../flowchart/interface';
import { HanderFlowchart } from '../../flowchart/handle';
import { WorkflowState } from '../state/WorkflowState';
import { WorkflowEventBus, WorkflowEventType } from '../events/WorkflowEventBus';

/**
 * 菜单服务
 * 负责处理菜单相关的业务逻辑
 */
export class MenuService {
	constructor(
		private flowchart: HanderFlowchart,
		private state: WorkflowState,
		private eventBus: WorkflowEventBus
	) {}

	/**
	 * 显示节点菜单
	 */
	showNodeMenu(node: INodeModel, posX: number, posY: number): void {
		this.state.setMenuState(
			node.key,
			posX - 100, // 偏移量
			posY,
			2 // 节点操作菜单
		);
		this.state.showNodeSetting = true;
		this.eventBus.emit(WorkflowEventType.MENU_SHOW, { type: 'node', node, posX, posY });
	}

	/**
	 * 隐藏节点菜单
	 */
	hideNodeMenu(): void {
		this.state.resetMenuState();
		this.state.addLog('hide NodeSetting');
		this.eventBus.emit(WorkflowEventType.MENU_HIDE, { type: 'node' });
	}

	/**
	 * 显示线条菜单
	 */
	showLineMenu(line: ILineModel, posX: number, posY: number): void {
		this.state.currentActionLine = line;
		this.state.setMenuState('', posX, posY, 1); // 添加节点菜单
		this.eventBus.emit(WorkflowEventType.MENU_SHOW, { type: 'line', line, posX, posY });
	}

	/**
	 * 隐藏线条菜单
	 */
	hideLineMenu(): void {
		this.state.currentActionLine = undefined;
		this.state.resetMenuState();
		this.eventBus.emit(WorkflowEventType.MENU_HIDE, { type: 'line' });
	}

	/**
	 * 显示节点设置面板
	 */
	showNodeSetting(node: INodeModel, posX: number, posY: number): void {
		this.state.addLog(`Show NodeSetting,${posX},${posY},${node.label}`);
		this.state.showNodeSetting = true;
	}

	/**
	 * 显示节点信息面板
	 */
	showNodeInfo(node: INodeModel, posX: number, posY: number): void {
		this.state.setMenuState(node.key, posX, posY, 3); // 循环信息菜单
		this.eventBus.emit(WorkflowEventType.MENU_SHOW, { type: 'info', node, posX, posY });
	}

	/**
	 * 计算线条位置
	 */
	calculateLinePosition(line: ILineModel): { x: number; y: number } {
		return this.flowchart.onGetLineDocumentOffsetForMenu(line);
	}

	/**
	 * 处理菜单视图变化
	 */
	handleViewChanged(): void {
		if (!this.state.currentNodeMenuShowType) {
			return;
		}

		switch (this.state.currentNodeMenuShowType) {
			case 2: // 节点操作菜单
				this.handleNodeOperationMenu();
				break;
			case 1: // 添加节点菜单
				this.handleAddNodeMenu();
				break;
			case 3: // 循环信息菜单
				this.handleLoopInfoMenu();
				break;
		}
	}

	private handleNodeOperationMenu(): void {
		if (!this.state.currentActionNodeKey) return;

		const node = this.getNodeData(this.state.currentActionNodeKey);
		if (!node) return;

		const pos = this.calculateNodePosition(this.state.currentActionNodeKey);
		this.showNodeMenu(node, pos.x + this.state.currentNodeMenuPosXOffset, pos.y);
	}

	private handleAddNodeMenu(): void {
		if (!this.state.currentActionLine) return;

		const pos = this.calculateLinePosition(this.state.currentActionLine);
		this.showLineMenu(this.state.currentActionLine, pos.x, pos.y);
	}

	private handleLoopInfoMenu(): void {
		if (!this.state.currentActionNodeKey) return;

		const node = this.getNodeData(this.state.currentActionNodeKey);
		if (!node) return;

		const pos = this.calculateNodePosition(this.state.currentActionNodeKey);
		this.showNodeInfo(node, pos.x, pos.y);
	}

	private getNodeData(nodeKey: string): INodeModel | null {
		return this.flowchart.onGetNode(nodeKey) || null;
	}

	private calculateNodePosition(nodeKey: string): { x: number; y: number } {
		return this.flowchart.onGetNodeDocumentOffsetForMenu(nodeKey);
	}
}
