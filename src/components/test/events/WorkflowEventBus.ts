// 事件总线不需要直接导入这些类型

/**
 * 工作流事件类型
 */
export enum WorkflowEventType {
	NODE_CLICK = 'node_click',
	NODE_DOUBLE_CLICK = 'node_double_click',
	NODE_DELETE = 'node_delete',
	NODE_ADD = 'node_add',
	MENU_SHOW = 'menu_show',
	MENU_HIDE = 'menu_hide',
	FLOW_CHANGE = 'flow_change',
	INIT = 'init'
}

/**
 * 工作流事件数据
 */
export interface WorkflowEventData {
	type: WorkflowEventType;
	payload?: any;
	timestamp: number;
}

/**
 * 事件监听器类型
 */
export type EventListener = (data: WorkflowEventData) => void;

/**
 * 工作流事件总线
 * 负责处理组件间的事件通信
 */
export class WorkflowEventBus {
	private listeners: Map<WorkflowEventType, EventListener[]> = new Map();

	/**
	 * 注册事件监听器
	 */
	on(eventType: WorkflowEventType, listener: EventListener) {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, []);
		}
		this.listeners.get(eventType)!.push(listener);
	}

	/**
	 * 移除事件监听器
	 */
	off(eventType: WorkflowEventType, listener: EventListener) {
		const listeners = this.listeners.get(eventType);
		if (listeners) {
			const index = listeners.indexOf(listener);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		}
	}

	/**
	 * 触发事件
	 */
	emit(eventType: WorkflowEventType, payload?: any) {
		const listeners = this.listeners.get(eventType);
		if (listeners) {
			const eventData: WorkflowEventData = {
				type: eventType,
				payload,
				timestamp: Date.now()
			};
			listeners.forEach(listener => listener(eventData));
		}
	}

	/**
	 * 清空所有监听器
	 */
	clear() {
		this.listeners.clear();
	}
}
