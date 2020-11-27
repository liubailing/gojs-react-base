import Linked from './linked';
import { ILineModel, INodeModel, IDiagramModel } from '../interface';
import { LineStore, NodeStore } from '../store';
import { NodeEnum } from '../enum';

export default class FlowchartModel extends Linked<INodeModel> {
	/**
	 * 以下是 点 相关的缓存数据
	 * 不是所有点。出去辅助节点
	 * /

	/**
	 * 缓存 nodeKey - 缓存的数据
	 */
	mapNodeData: Map<string, object>;
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

	hasChildsNodeType: Array<NodeEnum> = [NodeEnum.Condition, NodeEnum.Branch, NodeEnum.Loop];

	constructor() {
		super();

		this.mapNode = new Map();
		this.mapNodeData = new Map<string, object>();
		this.mapNodeBrotherKeys = new Map<string, Array<string>>();
		this.mapNodeChildKeys = new Map<string, Array<string>>();
	}

	toDiagram(): IDiagramModel<INodeModel, ILineModel> {
		let data: IDiagramModel<INodeModel, ILineModel> = { nodeArray: [], linkArray: [] };

		let item = this._header.next;
		let preItem = this._header;

		const childKeys: Array<string> = [];

		if (item.value && item.value.group) {
			this.toArray().forEach((x) => {
				// console.log(x);
				childKeys.push(x.key);
			});
			this.mapNodeChildKeys.set(item.value.group, childKeys);
		}

		while (item !== this._tail) {
			// 添加到数组
			data.nodeArray.push(item.value);
			if (preItem.value && preItem.value.type !== NodeEnum.Branch) {
				const l = LineStore.getLink(preItem.value.key, item.value.key, '');
				data.linkArray.push(l);
			}

			// 完善缓存
			this.mapNodeBrotherKeys.set(item.value.key, childKeys);
			if (!this.hasChildsNodeType.includes(item.value.type as NodeEnum)) {
				item.value.childs = null;
			}
			this.mapNode.set(item.value.key, item.value);

			// 处理子节点
			if (item.value.childs) {
				const curData = item.value.childs.toDiagram();

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

	add2Next8NodeId(nodekey: string, type: NodeEnum): boolean {
		const newNode = this.getNodeModel8Type(type, '');
		return this.insert8NodeId(nodekey, newNode);
	}

	add2Pre8NodeId(nodekey: string, type: NodeEnum): boolean {
		let item = this._header.next;
		let preItem = this._header;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				const newNode = this.getNodeModel8Type(type, item.value.group);
				if (item.value.type === NodeEnum.SubClose) {
					// 去判断下一次节点是不是 wfguide;
					// let nextNode = item.next;

					// 替换
					if (preItem.value.type === NodeEnum.WFGuideNode) {
						return this.replace(preItem.value, newNode);
					}
				} else if (item.value.type === NodeEnum.WFGuideNode) {
					// 如果自身就是 wfguide
					return this.replace(item.value, newNode);
				} else if (item.value.type === NodeEnum.SubOpen) {
					return false;
				}

				return this.insertPre(item.value, newNode);
			}

			if (item.value.childs) {
				const res = item.value.childs.add2Pre8NodeId(nodekey, type);
				if (res) {
					if (item.value.type === NodeEnum.Condition) {
						let cItem = item.value.childs._header.next;
						let idx = 0;
						while (cItem !== item.value.childs._tail) {
							cItem.value.sortIndex = idx++;
							cItem = cItem.next;
						}
					}
					return res;
				}
			}
			preItem = item;
			item = item.next;
		}

		return false;
	}

	add2Inner8NodeId(nodekey: string, type: NodeEnum): boolean {
		let item = this._header.next;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				if (item.value.childs) {
					const newNode = this.getNodeModel8Type(type, item.value.key);
					if (type === NodeEnum.Branch) {
						newNode.sortIndex = item.value.childs.size();
						return item.value.childs.add(newNode);
					}
					const tailPre = item.value.childs.tailPre();
					if (tailPre.type === NodeEnum.WFGuideNode) {
						return item.value.childs.replace(tailPre, newNode);
					}
					return item.value.childs.insert(tailPre, newNode);
				}
			}

			if (item.value.childs) {
				const res = item.value.childs.add2Inner8NodeId(nodekey, type);
				if (res) {
					return res;
				}
			}

			item = item.next;
		}

		return false;
	}

	/**
	 * 移除节点
	 * @param nodekey 移除的节点ID
	 */
	remove8NodeId(nodekey: string): INodeModel | null {
		let item = this._header.next;
		let preItem = this._header;
		while (item !== this._tail) {
			if (item.value.key === nodekey) {
				const resV = item.value;
				let resAct = false;
				if (this.size() === 3 && preItem.value.type === NodeEnum.SubOpen) {
					const newNode = NodeStore.getNode(NodeEnum.WFGuideNode, item.value.group);
					const res = this.replace(item.value, newNode);
					if (res) {
						resAct = true;
					}
				} else {
					const res = this.remove(item.value);
					if (res) {
						resAct = true;
					}
				}
				if (resAct) {
					return resV;
				}
			}

			if (item.value.childs) {
				const res = item.value.childs.remove8NodeId(nodekey);
				if (res) {
					return res;
				}
			}
			preItem = item;
			item = item.next;
		}

		return null;
	}

	/**
	 * 移动节点
	 * @param nodekey
	 * @param toNodekey
	 */
	removeNode2Node(nodekey: string, toNodekey: string): boolean {
		// 先移走
		const res = this.remove8NodeId(nodekey);
		if (res) {
			// 再插入
			return this.insert8NodeId(toNodekey, res);
		}
		return false;
	}

	copyNode2Node(nodekey: string, toNodekey: string): boolean {
		const toNode = this.mapNode.get(toNodekey);
		if (toNode) {
			const newM = this.getNode8Copy(nodekey, '');
			if (newM) {
				if (toNode.type === NodeEnum.Loop || toNode.type === NodeEnum.Branch) {
					const childs = this.mapNodeChildKeys.get(toNodekey);

					if (childs && childs.length > 2) {
						return this.insert8NodeId(childs[childs.length - 2], newM);
					}
				} else {
					return this.insert8NodeId(toNodekey, newM);
				}
			}
		}
		return false;
	}

	private getNode8Copy(nodekey: string, groupId: string): INodeModel | null {
		const newM = this.mapNode.get(nodekey);
		let newC: FlowchartModel | null = null;

		if (newM) {
			// 将要扥到的结果
			const res = { ...newM, ...{ key: NodeStore.getRandomKey(), group: groupId } };
			if (newM.childs) {
				newC = new FlowchartModel();
				let idxItem = newM.childs._header.next;
				while (idxItem !== newM.childs._tail) {
					if (idxItem.value) {
						const newN = this.getNode8Copy(idxItem.value.key, res.key);
						// 追加子节点
						if (newN) {
							newC.add(newN);
						}
					}

					idxItem = idxItem.next;
				}
				// 赋值
				if (newC) {
					res.childs = newC;
				}
			}
			return res;
		}
		return null;
	}

	/**
	 * 插入
	 * @param nodekey
	 * @param newNode
	 */
	private getNodeModel8Type(type: NodeEnum, group: string): INodeModel {
		const newNode = NodeStore.getNode(type, group);
		if (type === NodeEnum.Loop || type === NodeEnum.Branch) {
			newNode.childs = new FlowchartModel();
			newNode.childs.add(NodeStore.getNode(NodeEnum.SubOpen, newNode.key));
			newNode.childs.add(NodeStore.getNode(NodeEnum.WFGuideNode, newNode.key));
			newNode.childs.add(NodeStore.getNode(NodeEnum.SubClose, newNode.key));
		} else if (type === NodeEnum.Condition) {
			newNode.childs = new FlowchartModel();
			const branch1 = NodeStore.getNode(NodeEnum.Branch, newNode.key);
			branch1.childs = new FlowchartModel();
			branch1.childs.add(NodeStore.getNode(NodeEnum.SubOpen, branch1.key));
			branch1.childs.add(NodeStore.getNode(NodeEnum.WFGuideNode, branch1.key));
			branch1.childs.add(NodeStore.getNode(NodeEnum.SubClose, branch1.key));

			const branch2 = NodeStore.getNode(NodeEnum.Branch, newNode.key);
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
					const nextNode = item.next;

					// 替换
					if (nextNode.value.type === NodeEnum.WFGuideNode) {
						return this.replace(nextNode.value, newNode);
					}
				} else if (item.value.type === NodeEnum.WFGuideNode) {
					// 如果自身就是 wfguide
					return this.replace(item.value, newNode);
				} else if (item.value.type === NodeEnum.SubClose) {
					// 结束点后面插入
					return false;
				}

				return this.insert(item.value, newNode);
			}

			if (item.value.childs) {
				const res = item.value.childs.insert8NodeId(nodekey, newNode);

				if (res) {
					if (item.value.type === NodeEnum.Condition) {
						let cItem = item.value.childs._header.next;
						let idx = 0;
						while (cItem !== item.value.childs._tail) {
							cItem.value.sortIndex = idx++;
							cItem = cItem.next;
						}
					}
					return res;
				}
			}

			item = item.next;
		}

		return false;
	}
}
