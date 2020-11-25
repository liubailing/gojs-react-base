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
	add2Next8NodeId(nodeId: string, type: NodeEnum): boolean {
		const res = this._data.add2Next8NodeId(nodeId, type);
		if (res) {
			return true;
		}
		return res;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2Pre8NodeId(nodeId: string, type: NodeEnum): boolean {
		const res = this._data.add2Pre8NodeId(nodeId, type);
		if (res) {
			return true;
		}
		return res;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2InnerTail8NodeId(nodeId: string, type: NodeEnum): boolean {
		const res = this._data.add2Inner8NodeId(nodeId, type);
		if (res) {
			return true;
		}
		return res;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2InnerHeader8NodeId(nodeId: string, type: NodeEnum): boolean {
		const childs = this.mapNodeChildKeys.get(nodeId);
		if (childs && childs.length > 0) {
			const res = this._data.add2Next8NodeId(childs[0], type);
			if (res) {
				return true;
			}
		}
		return false;
	}

	remove8NodeId(nodeId: string) {
		const res = this._data.remove8NodeId(nodeId);
		if (res) {
			return true;
		}
		return res;
	}

	removeNode2Node(nodekey: string, toNodekey: string) {
		const res = this._data.removeNode2Node(nodekey, toNodekey);
		if (res) {
			return true;
		}
		return res;
	}

	copyNode2Node(nodekey: string, toNodekey: string) {
		const res = this._data.copyNode2Node(nodekey, toNodekey);
		if (res) {
			return true;
		}
		return res;
	}

	getDiagram() {
		const res = this._data.toDiagram();
		this.mapNode = this._data.mapNode;
		this.mapNodeChildKeys = this._data.mapNodeChildKeys;
		this.mapNodeBrotherKeys = this._data.mapNodeBrotherKeys;
		return res;
	}
}
