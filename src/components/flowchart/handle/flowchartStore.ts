import { NodeEnum } from '../enum';
import { INodeModel } from '../interface';
import { FlowchartModel } from '../model';

/**
 * 处理数据
 */
export default class FlowchartStore {
	_data: FlowchartModel;

	/** 节点对应数据  */
	mapNode: Map<string, INodeModel>;

	// 复杂的对应关系
	/** 节点的 兄弟节点 */
	mapNodeBrotherKeys: Map<string, Array<string>>;

	/** 节点的 子节点 */
	mapNodeChildKeys: Map<string, Array<string>>;

	constructor() {
		// this
		this._data = new FlowchartModel();

		this.mapNode = new Map();

		this.mapNodeBrotherKeys = new Map<string, Array<string>>();
		this.mapNodeChildKeys = new Map<string, Array<string>>();
	}

	/**
	 * 刷新业务数据
	 * @param nodeDataArray
	 * @param linkDataArray
	 */
	refresData(fcdata: FlowchartModel) {
		this._data = fcdata;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2Next8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this._data.add2Next8NodeId(nodeId, type);
		if (res) {
			return res;
		}
		return res;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2Pre8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this._data.add2Pre8NodeId(nodeId, type);
		if (res) {
			return res;
		}
		return '';
	}

	/**
	 * 往内部结尾追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2InnerTail8NodeId(nodeId: string, type: NodeEnum): string {
		const res = this._data.add2Inner8NodeId(nodeId, type);
		if (res) {
			return res;
		}
		return '';
	}

	/**
	 * 在一个节点外面追加一个循环
	 * *注意* 不能是分支节点
	 * @param nodekey
	 */
	add2InnerLoop8NodeId(nodeId: string): string {
		const res = this._data.add2InnerLoop8NodeId(nodeId);
		if (res) {
			return res;
		}
		return '';
	}

	/**
	 * 往内部开头追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2InnerHeader8NodeId(nodeId: string, type: NodeEnum): string {
		const childs = this.mapNodeChildKeys.get(nodeId);
		if (childs && childs.length > 0) {
			const res = this._data.add2Next8NodeId(childs[0], type);
			if (res) {
				return res;
			}
		}
		return '';
	}

	remove8NodeId(nodeId: string): boolean {
		const res = this._data.remove8NodeId(nodeId);
		if (res) {
			return true;
		}
		return false;
	}

	removeNode2Node(nodekey: string, toNodekey: string): boolean {
		const res = this._data.removeNode2Node(nodekey, toNodekey);
		if (res) {
			return true;
		}
		return res;
	}

	copyNode2Node(nodekey: string, toNodekey: string): string {
		const res = this._data.copyNode2Node(nodekey, toNodekey);
		if (res) {
			return res;
		}
		return '';
	}

	getDiagram() {
		this._data.init();
		const res = this._data.toDiagram();
		this.mapNode = this._data.mapNode;
		this.mapNodeChildKeys = this._data.mapNodeChildKeys;
		this.mapNodeBrotherKeys = this._data.mapNodeBrotherKeys;
		return res;
	}
}

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
