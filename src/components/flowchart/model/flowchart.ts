import Linked from './linked';
import { ILineModel, INodeModel, IDiagramModel } from '../interface';
import { LineStore, NodeStore } from '../store';
import { NodeEnum } from '../enum';
export default class FlowchartModel extends Linked<INodeModel> {
	/**
	 * 以下是 点 相关的缓存数据
	 * 不是所有点。出去辅助节点
	 * /


	/** 节点对应数据  */
	mapNode: Map<string, INodeModel>;

	// 复杂的对应关系
	/** 节点的 兄弟节点 */
	mapNodeBrotherKeys: Map<string, Array<string>>;
	/** 节点的 子节点 */
	mapNodeChildKeys: Map<string, Array<string>>;

	guidNodeType: Array<NodeEnum> = [
		NodeEnum.Start,
		NodeEnum.End,
		NodeEnum.SubOpen,
		NodeEnum.WFGuideNode,
		NodeEnum.SubClose
	];
	constructor() {
		super();

		this.mapNode = new Map();

		this.mapNodeBrotherKeys = new Map<string, Array<string>>();
		this.mapNodeChildKeys = new Map<string, Array<string>>();
	}

	toDiagram(): IDiagramModel<INodeModel, ILineModel> {
		let data: IDiagramModel<INodeModel, ILineModel> = { nodeArray: [], linkArray: [] };

		let item = this._header.next;
		let preItem = this._header;

		let childKeys: Array<string> = [];

		if (item.value && item.value.group) {
			this.toArray().map((x) => {
				// console.log(x);
				childKeys.push(x.key);
			});
			this.mapNodeChildKeys.set(item.value.group, childKeys);
		}

		while (item !== this._tail) {
			// 添加到数组
			data.nodeArray.push(item.value);
			if (preItem.value && preItem.value.type !== NodeEnum.Branch) {
				let l = LineStore.getLink(preItem.value.key, item.value.key, '');
				data.linkArray.push(l);
			}

			// 完善缓存
			this.mapNodeBrotherKeys.set(item.value.key, childKeys);
			this.mapNode.set(item.value.key, item.value);

			// 处理子节点
			if (item.value.childs) {
				let curData = item.value.childs.toDiagram();

				// 完善缓存
				this.doCacheh(item.value.childs);
				data = {
					nodeArray: [...data.nodeArray, ...curData.nodeArray],
					linkArray: [...data.linkArray, ...curData.linkArray]
				};
			}

			// 下一轮循环
			preItem = item;
			item = item.next;
			this.doCacheh(this);
		}

		return data;
	}

	doCacheh(item: FlowchartModel) {
		item.mapNodeChildKeys.forEach((v, k) => {
			if (k !== '' && k !== null) {
				this.mapNodeChildKeys.set(k, v);
			}
		});
		item.mapNode.forEach((v, k) => {
			if (k !== '' && k !== null) {
				this.mapNode.set(k, v);
			}
		});
		item.mapNodeBrotherKeys.forEach((v, k) => {
			if (k !== '' && k !== null) {
				this.mapNodeBrotherKeys.set(k, v);
			}
		});
	}

	add2After8NodeId(nodekey: string, type: NodeEnum): boolean {
		let newNode = this.getNodeModel8Type(type, '');
		return this.insert8NodeId(nodekey, newNode);
	}

	add2Before8NodeId(nodekey: string, type: NodeEnum): boolean {
		let item = this._header.next;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				let newNode = this.getNodeModel8Type(type, item.value.group);
				if (item.value.type === NodeEnum.SubOpen) {
					// 去判断下一次节点是不是 wfguide;
					let nextNode = item.next;

					// 替换
					if (nextNode.value.type === NodeEnum.WFGuideNode) {
						return this.replace(nextNode.value, newNode);
					}
				} else if (item.value.type === NodeEnum.WFGuideNode) {
					// 如果自身就是 wfguide
					return this.replace(item.value, newNode);
				}
				return this.insert(item.value, newNode);
			}

			if (item.value.childs) {
				let res = item.value.childs.add2After8NodeId(nodekey, type);
				if (res) {
					return res;
				}
			}

			item = item.next;
		}

		return false;
	}

	add2Inner8NodeId(nodekey: string, type: NodeEnum): boolean {
		let item = this._header.next;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				if (item.value.childs) {
					let newNode = this.getNodeModel8Type(type, item.value.key);
					if (type === NodeEnum.Branch) {
						newNode.sortIndex = item.value.childs.size();
						return item.value.childs.add(newNode);
					} else {
						let tailPre = item.value.childs.tailPre();
						if (tailPre.type === NodeEnum.WFGuideNode) {
							return item.value.childs.replace(tailPre, newNode);
						} else {
							return item.value.childs.insert(tailPre, newNode);
						}
					}
				}
			}

			if (item.value.childs) {
				let res = item.value.childs.add2Inner8NodeId(nodekey, type);
				if (res) {
					return res;
				}
			}

			item = item.next;
		}

		return false;
	}

	remove8NodeId(nodekey: string): INodeModel | null {
		let item = this._header.next;
		let preItem = this._header;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				let resV = item.value;
				let resAct = false;
				if (this.size() === 3 && preItem.value.type === NodeEnum.SubOpen) {
					let newNode = NodeStore.getNode(NodeEnum.WFGuideNode, item.value.group);
					let res = this.replace(item.value, newNode);
					if (res) {
						resAct = true;
					}
				} else {
					let res = this.remove(item.value);
					if (res) {
						resAct = true;
					}
				}
				if (resAct) {
					return resV;
				}
			}

			if (item.value.childs) {
				let res = item.value.childs.remove8NodeId(nodekey);
				if (res) {
					return res;
				}
			}
			preItem = item;
			item = item.next;
		}

		return null;
	}

	removeNode2Node(nodekey: string, toNodekey: string): boolean {
		let res = this.remove8NodeId(nodekey);
		if (res) {
			return this.insert8NodeId(toNodekey, res);
		}
		return false;
	}

	copyNode2Node(nodekey: string, toNodekey: string): boolean {
		let res = this.remove8NodeId(nodekey);
		if (res) {
			return this.insert8NodeId(toNodekey, res);
		}
		return false;
	}

	getNode8NodeId() {}

	private getNodeModel8Type(type: NodeEnum, group: string): INodeModel {
		let newNode = NodeStore.getNode(type, group);
		if (type === NodeEnum.Loop || type === NodeEnum.Branch) {
			newNode.childs = new FlowchartModel();
			newNode.childs.add(NodeStore.getNode(NodeEnum.SubOpen, newNode.key));
			newNode.childs.add(NodeStore.getNode(NodeEnum.WFGuideNode, newNode.key));
			newNode.childs.add(NodeStore.getNode(NodeEnum.SubClose, newNode.key));
		} else if (type === NodeEnum.Condition) {
			newNode.childs = new FlowchartModel();
			let branch1 = NodeStore.getNode(NodeEnum.Branch, newNode.key);
			branch1.childs = new FlowchartModel();
			branch1.childs.add(NodeStore.getNode(NodeEnum.SubOpen, branch1.key));
			branch1.childs.add(NodeStore.getNode(NodeEnum.WFGuideNode, branch1.key));
			branch1.childs.add(NodeStore.getNode(NodeEnum.SubClose, branch1.key));

			let branch2 = NodeStore.getNode(NodeEnum.Branch, newNode.key);
			branch2.childs = new FlowchartModel();
			branch2.childs.add(NodeStore.getNode(NodeEnum.SubOpen, branch2.key));
			branch2.childs.add(NodeStore.getNode(NodeEnum.WFGuideNode, branch2.key));
			branch2.childs.add(NodeStore.getNode(NodeEnum.SubClose, branch2.key));

			newNode.childs.add(branch1);
			newNode.childs.add(branch2);
		}
		return newNode;
	}

	/**
	 * 插入
	 * @param nodekey
	 * @param newNode
	 */
	private insert8NodeId(nodekey: string, newNode: INodeModel): boolean {
		let item = this._header.next;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				newNode.group = item.value.group;
				if (item.value.type === NodeEnum.SubOpen) {
					// 去判断下一次节点是不是 wfguide;
					let nextNode = item.next;

					// 替换
					if (nextNode.value.type === NodeEnum.WFGuideNode) {
						return this.replace(nextNode.value, newNode);
					}
				} else if (item.value.type === NodeEnum.WFGuideNode) {
					// 如果自身就是 wfguide
					return this.replace(item.value, newNode);
				}
				return this.insert(item.value, newNode);
			}

			if (item.value.childs) {
				let res = item.value.childs.insert8NodeId(nodekey, newNode);
				if (res) {
					return res;
				}
			}

			item = item.next;
		}

		return false;
	}
}
