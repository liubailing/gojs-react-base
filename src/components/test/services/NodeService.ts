import { INodeModel } from '../../flowchart/interface';
import { HanderFlowchart } from '../../flowchart/handle';
import { WorkflowState } from '../state/WorkflowState';
import { WorkflowEventBus, WorkflowEventType } from '../events/WorkflowEventBus';

/**
 * 节点服务
 * 负责处理节点相关的业务逻辑
 */
export class NodeService {
	constructor(
		private flowchart: HanderFlowchart,
		private state: WorkflowState,
		private eventBus: WorkflowEventBus
	) {}

	/**
	 * 处理节点点击
	 */
	handleNodeClick(node: INodeModel, isManual = false): void {
		this.state.addLog(`handler -click ${node.key}${isManual ? ' (manual)' : ''}`);
		
		// 获取节点导航键
		this.flowchart.onGetNodeNavigateKey(node.key);
		
		// 更新状态
		this.state.currentActionNodeKey = node.key;
		this.state.showNodeSetting = true;

		// 触发事件
		this.eventBus.emit(WorkflowEventType.NODE_CLICK, { node, isManual });
	}

	/**
	 * 处理节点双击
	 */
	handleNodeDoubleClick(node: INodeModel): void {
		const loopKey = this.flowchart.onGetNodeFirstLoopKey(node.key) || '';
		
		this.state.addLog(`handler -clickagin loop ${loopKey}`);
		this.state.showNodeSetting = true;
		this.state.currentActionNodeKey = node.key;

		this.eventBus.emit(WorkflowEventType.NODE_DOUBLE_CLICK, { node, loopKey });
	}

	/**
	 * 处理节点删除
	 */
	handleNodeDelete(currKey: string, deleteKey: string): void {
		this.state.addLog(`handler -delete ${currKey}, ${deleteKey}`);
		this.eventBus.emit(WorkflowEventType.NODE_DELETE, { currKey, deleteKey });
	}

	/**
	 * 处理节点添加
	 */
	handleNodeAdd(node: INodeModel): void {
		this.state.addLog(`handler -add ${node.key}`);
		this.eventBus.emit(WorkflowEventType.NODE_ADD, { node });
	}

	/**
	 * 获取节点数据
	 */
	getNodeData(nodeKey: string): INodeModel | null {
		return this.flowchart.onGetNode(nodeKey) || null;
	}

	/**
	 * 计算节点位置
	 */
	calculateNodePosition(nodeKey: string): { x: number; y: number } {
		return this.flowchart.onGetNodeDocumentOffsetForMenu(nodeKey);
	}
}
