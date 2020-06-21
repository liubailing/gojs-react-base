import { LineModel, NodeModel } from '../interface';

/**
 * 处理数据
 */
export default class HanderFlowchart {
	mapNodeKeyIdx: Map<go.Key, number>;
	mapLinkKeyIdx: Map<go.Key, number>;
	nodeDataArray: Array<NodeModel> = [];
	linkDataArray: Array<LineModel> = [];
	constructor() {
		this.mapNodeKeyIdx = new Map<go.Key, number>();
		this.mapLinkKeyIdx = new Map<go.Key, number>();

	}
	initData() {
		this.refreshLinkIndex(this.linkDataArray);
		this.refreshNodeIndex(this.nodeDataArray);
	}

	/**
	 * Update map of node keys to their index in the array.
	 */
	private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
		this.mapNodeKeyIdx.clear();
		nodeArr.forEach((n: go.ObjectData, idx: number) => {
			this.mapNodeKeyIdx.set(n.key, idx);
		});
	}

	/**
	 * Update map of link keys to their index in the array.
	 */
	private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
		this.mapLinkKeyIdx.clear();
		linkArr.forEach((l: go.ObjectData, idx: number) => {
			this.mapLinkKeyIdx.set(l.key, idx);
		});
	}
}
