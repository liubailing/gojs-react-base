import { NodeEnum } from '../enum';
import { ILineModel, INodeModel } from '../interface';
import { FlowchartModel } from '../model';

/**
 * 各种操作的中间数据
 */
type FCModel = {
	nodes: INodeModel[];
	lines: ILineModel[];
};

/**
 * 辅助点
 * 这些节点存在只为展示，不出现在最后的数据里面
 *  */
const nodeEnum2Helper: NodeEnum[] = [
	NodeEnum.WFGuideNode,
	NodeEnum.Start,
	NodeEnum.End,
	NodeEnum.SubOpen,
	NodeEnum.SubClose
];

/**
 * 辅助点
 * 这些节点存在只为展示，不出现在最后的数据里面
 *  */
enum AddBranchEnum {
	pre,
	next,
	inner
}

/**
 * 节点类型
 * 可以包含子节点的数据节点
 *  */
const nodeEnum2HasChild: NodeEnum[] = [NodeEnum.Loop, NodeEnum.Condition, NodeEnum.Branch];

/**
 * 处理数据
 */
export default class FlowchartStore {
	private _data: FlowchartModel;

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
		let res = this._data.add2Next8NodeId(nodeId, type);
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
		let res = this._data.add2Pre8NodeId(nodeId, type);
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
		let res = this._data.add2Inner8NodeId(nodeId, type);
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
		let childs = this.mapNodeChildKeys.get(nodeId);
		if (childs && childs.length > 0) {
			let res = this._data.add2Next8NodeId(childs[0], type);
			if (res) {
				return true;
			}
		}
		return false;
	}

	remove8NodeId(nodeId: string) {
		let res = this._data.remove8NodeId(nodeId);
		if (res) {
			return true;
		}
		return res;
	}

	removeNode2Node(nodekey: string, toNodekey: string) {
		let res = this._data.removeNode2Node(nodekey, toNodekey);
		if (res) {
			return true;
		}
		return res;
	}

	copyNode2Node(nodekey: string, toNodekey: string) {
		let res = this._data.removeNode2Node(nodekey, toNodekey);
		if (res) {
			return true;
		}
		return res;
	}

	getDiagram() {
		let res = this._data.toDiagram();
		this.mapNode = this._data.mapNode;
		this.mapNodeChildKeys = this._data.mapNodeChildKeys;
		this.mapNodeBrotherKeys = this._data.mapNodeBrotherKeys;
		return res;
	}
}
