import { NodeEnum, DiagramEnum } from '../enum';
import { ILineModel, INodeModel } from '../interface';
import { NodeStore, LineStore } from '../store';

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
export default class HanderFlowchartData {
	//以下是 线 相关的缓存数据
	mapLineKeyIdx: Map<string, number>;
	mapLineFromTo = new Map<string, string>();
	private _nodes: Array<INodeModel> = [];
	private _lines: Array<ILineModel> = [];

	//以下是 点 相关的缓存数据
	mapNodeKeyIdx: Map<string, number>;
	mapNodeParent: Map<string, string>;
	mapNodeType: Map<string, NodeEnum>;
	mapNode: Map<string, INodeModel>;

	// 复杂的对应关系
	mapNodeBrotherKeys: Map<string, Array<string>>;
	mapNodeChildKeys: Map<string, Array<string>>;
	mapNodeType2Keys: Map<string, Array<string>>;

	// 特殊的关系（主要是对应业务）
	mapNodeNavigate: Map<string, string>;

	constructor() {
		this.mapLineFromTo = new Map<string, string>();
		this.mapLineKeyIdx = new Map<string, number>();

		this.mapNodeKeyIdx = new Map<string, number>();
		this.mapNode = new Map();
		this.mapNodeType = new Map<string, NodeEnum>();
		// mapNode: Map<string, ActionNode> = new Map();
		// mapNodeIndex: Map<string, number> = new Map();

		this.mapNodeParent = new Map<string, string>();
		this.mapNodeBrotherKeys = new Map<string, Array<string>>();
		this.mapNodeChildKeys = new Map<string, Array<string>>();
		this.mapNodeType2Keys = new Map<NodeEnum, Array<string>>();

		//特殊对应关系
		this.mapNodeNavigate = new Map<string, string>();
	}

	/**
	 * 刷星业务数据
	 * @param nodeDataArray
	 * @param linkDataArray
	 */
	refresData(nodeDataArray: Array<INodeModel>, linkDataArray: Array<ILineModel>) {
		this._lines = [...linkDataArray];
		this._nodes = [...nodeDataArray];
		// 1.刷星线的关系数据
		this.refreshLinkIndex(this._lines);
		// 2.刷新点的关系数据
		this.refreshNodeIndex(this._nodes);
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param type
	 */
	add2After8NodeId(nodekey: string, type: NodeEnum): boolean {
		let m = this.mapNode.get(nodekey);
		if (m) {
			let t = this.getAddData8NodeEnum(type, m.group);
			let newLine: ILineModel[] = [];
			if (t && t.nodes.length > 0) {
				let newNode = t.nodes[0];

				// 修改线的关系
				for (const it of this._lines) {
					if (it.from === nodekey) {
						it.from = newNode.key;
						break;
					}
				}
				// 如果是向导点
				if (m.category === DiagramEnum.WFGuideNode) {
					// 修改线的关系
					for (const it of this._lines) {
						if (it.to === nodekey) {
							it.to = newNode.key;
							break;
						}
					}
					// 删除向导点
					let ind = this.mapNodeKeyIdx.get(nodekey);
					if (ind !== undefined) {
						this._nodes = [...this._nodes.slice(0, ind), ...this._nodes.slice(ind + 1)];
					}
				} else {
					// 新增一条线
					newLine.push(LineStore.getLink(nodekey, newNode.key, newNode.group));
				}

				this._lines = [...this._lines, ...newLine, ...t.lines];
				this._nodes = [...this._nodes, ...t.nodes];

				// 刷新缓存数据
				this.refresData(this._nodes, this._lines);
				this.refresData(this._nodes, this._lines);

				return true;
			}
		}
		return false;
	}

	/**
	 * 内部追加
	 * @param nodekey
	 * @param type  当给条件内追加时候，必定为分支
	 */
	add2Inner8NodeId(nodekey: string, type: NodeEnum): boolean {
		let node = this.mapNode.get(nodekey);
		if (node && nodeEnum2HasChild.includes(node.type as NodeEnum)) {
			if (node.type === NodeEnum.Condition) {
				return this.addBranch2Inner(nodekey);
			} else {
				let childs = this.mapNodeChildKeys.get(nodekey);
				if (childs && childs.length > 1) {
					return this.add2After8NodeId(childs[childs.length - 2], type);
				}
			}
		}
		return false;
	}

	/**
	 * 追加到分支前
	 */
	addBranch2Pre(nodekey: string): boolean {
		return this.addBranch(nodekey, AddBranchEnum.pre);
	}

	/**
	 * 追加到分支后面
	 * @param nodekey
	 */
	addBranch2Next(nodekey: string): boolean {
		return this.addBranch(nodekey, AddBranchEnum.next);
	}

	/**
	 * 拖动
	 * @param nodekey
	 * @param toline
	 */
	dragNode2link(nodekey: string, toline?: ILineModel): boolean {
		let node = this.mapNode.get(nodekey);
		// 主要是改变线
		if (node && toline) {
			// 如果是前后线上，则无效操作
			let tolineGroup = this.mapNodeParent.get(toline.from) || 'root';
			if (toline.from === nodekey || toline.to === nodekey) {
				return false;
			}

			// 是否需要增加辅助接点
			let addGuid2OldGroup = '';
			// 是否需要移除辅助接点
			let removeTolieGroupGuideNodeId = '';

			// 2、判断 拖放后的组内是否要移除向导辅助点
			let formP = this.mapNode.get(node.group);
			if (formP && nodeEnum2HasChild.includes(formP.type as NodeEnum)) {
				let formChilds = this.mapNodeChildKeys.get(formP.key);
				if (formChilds && formChilds.length === 3) {
					addGuid2OldGroup = formChilds[1];
				}
			}

			// 2.1、判断 拖放后原来的组内是否要移除辅助点
			let toP = this.mapNode.get(tolineGroup);
			if (toP && nodeEnum2HasChild.includes(toP.type as NodeEnum)) {
				let toChilds = this.mapNodeChildKeys.get(toP.key);
				if (toChilds && toChilds.length === 3) {
					let node = this.mapNode.get(toChilds[1]);
					if (node && (node.type as NodeEnum) === NodeEnum.WFGuideNode) {
						removeTolieGroupGuideNodeId = toChilds[1];
					}
				}
			}

			// 3、如果需要补回辅助点
			if (addGuid2OldGroup) {
				let newGuid = NodeStore.getNode(NodeEnum.WFGuideNode, node.group);
				let hasStart = false,
					haseEnd = false;
				for (const it of this._lines) {
					if (it.from === nodekey) {
						it.from = newGuid.key;
						hasStart = true;
					}
					if (it.to === nodekey) {
						it.to = newGuid.key;
						haseEnd = true;
					}

					if (hasStart && haseEnd) {
						break;
					}
				}
				this._nodes.push(newGuid);
			} else {
				let removeLineIdx = 0;
				// 1、找出以前的in线
				let oldForm = '',
					oldTo = '';
				for (const [index, it] of this._lines.entries()) {
					if (it.to === nodekey) {
						console.log(`-1------`, index, it);
						oldForm = it.from;
						removeLineIdx = index;
						break;
					}
				}

				// 2、改掉以前的 out 线
				for (const [index, it] of this._lines.entries()) {
					if (it.from === nodekey) {
						it.from = oldForm;
						oldTo = it.to;

						console.log(`--2-----`, index, it);
						break;
					}
				}
				// 移除线
				this._lines = [...this._lines.slice(0, removeLineIdx), ...this._lines.slice(removeLineIdx + 1)];

				// 这一步表示不明白 1
				for (const [index, it] of this._lines.entries()) {
					if (it.from === nodekey && it.to === oldTo) {
						console.log(`--3-----`, index, it);
						// 移除线
						this._lines = [...this._lines.slice(0, index), ...this._lines.slice(index + 1)];
						break;
					}
				}

				// 这一步表示不明白 2
				for (const [index, it] of this._lines.entries()) {
					if (it.to === nodekey && it.from === oldForm) {
						console.log(`--3-----`, index, it);
						// 移除线
						this._lines = [...this._lines.slice(0, index), ...this._lines.slice(index + 1)];
						break;
					}
				}
			}

			// 如果需要移除之前的辅助点
			if (removeTolieGroupGuideNodeId) {
				let hasStart = false,
					haseEnd = false;
				for (const it of this._lines) {
					if (it.to === removeTolieGroupGuideNodeId) {
						it.to = nodekey;
						hasStart = true;
					}
					if (it.from === removeTolieGroupGuideNodeId) {
						it.from = nodekey;
						haseEnd = true;
					}

					if (hasStart && haseEnd) {
						break;
					}
				}
				// 移除点
				let nodeIdx = this.mapNodeKeyIdx.get(removeTolieGroupGuideNodeId);
				if (nodeIdx) {
					this._nodes = [...this._nodes.slice(0, nodeIdx), ...this._nodes.slice(nodeIdx + 1)];
				}
			} else {
				let newLine = LineStore.getLink(toline.from, nodekey, tolineGroup);
				for (const it of this._lines) {
					if (it.from === toline.from) {
						it.from = nodekey;
						break;
					}
				}
				this._lines.push(newLine);
			}

			// 	1 修改组
			let nodeIdx = this.mapNodeKeyIdx.get(nodekey);
			if (nodeIdx === undefined) return false;
			this._nodes[nodeIdx].group = tolineGroup;

			// 刷新数据
			this.refresData(this._nodes, this._lines);
			return true;
			//

			// 1.1可能要移除向导点

			// 2可能要新增向导点 改变之前的线
			// 2.1直接改变之前的线
		}
		return false;
	}

	/**
	 * 得到当前的线
	 */
	getLines() {
		return this._lines;
	}

	/**
	 * 得到当前的点
	 */
	getNodes() {
		return this._nodes;
	}

	/*****************************************
	 ******  以下是私有方法   *********
	 ****************************************/

	/**
	 * 往后追加分支
	 * @param nodekey
	 */
	private addBranch2Inner(nodekey: string): boolean {
		let node = this.mapNode.get(nodekey);
		if (node?.type === (NodeEnum.Condition as string)) {
			let childs = this.mapNodeChildKeys.get(nodekey);
			if (childs) {
				return this.addBranch(childs[childs?.length - 1], AddBranchEnum.next);
			}
		}
		return false;
	}

	/**
	 * 往后追加 一个节点
	 * @param nodekey
	 * @param isPreOrNext 是往前还是往后追加，默认往前追加
	 */
	private addBranch(nodekey: string, addType: AddBranchEnum): boolean {
		let m = this.mapNode.get(nodekey);
		let nodes = [...this._nodes];
		if (m) {
			let t = this.getAddData8NodeEnum(NodeEnum.Branch, m.group);
			if (t && t.nodes.length > 0) {
				let b = this.mapNodeBrotherKeys.get(nodekey);
				if (b) {
					let idx = b?.findIndex((x) => x === nodekey);
					let starIndex = idx;
					if (addType === AddBranchEnum.pre) {
						starIndex = idx;
					} else if (addType === AddBranchEnum.next) {
						starIndex = idx + 1;
					}

					t.nodes[0].sortIndex = starIndex;

					if (starIndex < 0) starIndex = 0;
					// 调整后面的排序
					b.forEach((v, i) => {
						if (i >= starIndex) {
							if (this.mapNodeKeyIdx.has(v)) {
								let cIdx = this.mapNodeKeyIdx.get(v);
								if (cIdx !== undefined && cIdx >= 0) {
									console.log('ids======', nodes[cIdx].key);
									nodes[cIdx].sortIndex = (nodes[cIdx].sortIndex || 0) + 1;
								}
							}
						}
					});
				}

				// 刷新缓存数据
				this._nodes = [...nodes, ...t.nodes];
				this._lines = [...this._lines, ...t.lines];
				this.refresData(this._nodes, this._lines);

				return true;
			}
		}
		return false;
	}

	/**
	 * Update map of link keys to their index in the array.
	 */
	private refreshLinkIndex(linkArr: Array<ILineModel>) {
		this.mapLineKeyIdx.clear();
		this.mapLineFromTo.clear();
		linkArr.forEach((l: ILineModel, idx: number) => {
			this.mapLineKeyIdx.set(l.key, idx);
			this.mapLineFromTo.set(l.from, l.to);
		});
	}

	/**
	 * Update map of node keys to their index in the array.
	 */
	private refreshNodeIndex(nodeArr: Array<INodeModel>) {
		this.mapNodeKeyIdx.clear();
		this.mapNodeParent.clear();
		this.mapNodeType.clear();
		this.mapNode.clear();
		// 第一次得到简单数据
		let types: Set<NodeEnum> = new Set();
		nodeArr.forEach((n: INodeModel, idx: number) => {
			this.mapNodeKeyIdx.set(n.key, idx);
			this.mapNodeParent.set(n.key, n.group);
			this.mapNodeType.set(n.key, n.type as NodeEnum);
			this.mapNode.set(n.key, n);
			types.add(n.type as NodeEnum);
		});

		// 3.刷星业务数据
		this.refreshFlowchartData(nodeArr, types);
	}

	/**
	 * 处理节点复杂的数据关系
	 * @param nodeArr
	 * @param types
	 */
	private refreshFlowchartData(nodeArr: Array<INodeModel>, types: Set<NodeEnum>) {
		this.mapNodeBrotherKeys.clear();
		this.mapNodeChildKeys.clear();
		this.mapNodeType2Keys.clear();
		// 1、第一次得到简单数据

		nodeArr.forEach((n: INodeModel, idx: number) => {
			if (nodeEnum2HasChild.includes(n.type as NodeEnum)) {
				let ids = this.getChilds8Node(nodeArr, n);

				for (const it of ids) {
					// 2、得到 兄弟节点关系
					this.mapNodeBrotherKeys.set(it, ids);
				}
				// 3、得到兄弟节点
				this.mapNodeChildKeys.set(n.key, ids);
			}
		});

		// 4、处理类型和节点的关系
		for (const it of types) {
			let ids: string[] = [];
			for (const ite of this.mapNodeType) {
				if (ite[1] === it) {
					ids.push(ite[0]);
				}
			}
			this.mapNodeType2Keys.set(it, ids);
		}
	}

	/**
	 * 找到对应的child，并且已经排好序
	 * @param nodeArr
	 * @param node
	 */
	private getChilds8Node(nodeArr: Array<INodeModel>, node: INodeModel): string[] {
		if (nodeArr.length < 1) return [];
		let childs: string[] = [];

		// 如果是条件分支
		if ((node.type as NodeEnum) === NodeEnum.Condition) {
			// 从 idx 0 开始找起，找齐全结束
			let sortIndex = 0;
			let goon = true;
			do {
				for (const it of nodeArr) {
					// 从起点开始找起
					if (it.group === node.key && it.sortIndex === sortIndex) {
						childs.push(it.key);
						break;
					}
				}

				if (childs.length < sortIndex) {
					goon = false;
				}
				sortIndex++;
			} while (goon);
		} else {
			let start = '';
			let end = '';
			for (const it of nodeArr) {
				if (it.group === node.key && it.category) {
					// 从起点开始找起
					if (it.category === (DiagramEnum.WFGuideSubOpen as string)) {
						start = it.key;
					}
					// 找到终点
					if (it.category === (DiagramEnum.WFGuideSubClose as string)) {
						end = it.key;
					}
				}
			}
			if (!start || !end) {
				console.log(`error 1`);
				return [];
			}
			childs = [start, end];

			let goon = true;
			do {
				let start2next = '',
					pre2End = '';
				for (const it of this.mapLineFromTo) {
					if (it[0] === start && !childs.includes(it[1])) start2next = it[1];
					if (it[1] === end && !childs.includes(it[0])) pre2End = it[0];
				}

				let mid = childs.length / 2;
				let addArr: string[] = start2next === pre2End ? [start2next] : [start2next, pre2End];
				childs = [...childs.slice(0, mid), ...addArr, ...childs.slice(mid)];

				if (pre2End === start || start2next === pre2End) {
					goon = false;
				}
			} while (goon);
		}
		return childs;
	}

	/**
	 *  按一个类型 增加制定类型节点，返回一个组成该类型所需要的点、线
	 *  @param fcType
	 *  @param node
	 *  @param group
	 */
	private getAddData8NodeEnum = (nodeEnmu: NodeEnum, groupKey: string, node?: INodeModel): FCModel => {
		let d: FCModel = {
			nodes: [],
			lines: []
		};
		let actNode: INodeModel | undefined = undefined;

		if (node && node.key) {
			actNode = node;
		} else {
			//let fc = new FcNode(fcType);
			//actNode = this.getOneNode(fcType, fc.name, group);
			actNode = NodeStore.getNode(nodeEnmu, groupKey);
		}

		if (!actNode) return d;

		switch (nodeEnmu) {
			case NodeEnum.Condition:
				actNode.isGroup = true;
				groupKey = actNode.key;
				// actNode.type = NodeEnum.Branch;
				let branch1 = this.getAddData8NodeEnum(NodeEnum.Branch, groupKey);
				let branch2 = this.getAddData8NodeEnum(NodeEnum.Branch, groupKey);
				branch1.nodes[0].sortIndex = 0;
				branch2.nodes[0].sortIndex = 1;
				d = {
					nodes: [actNode, ...branch1.nodes, ...branch2.nodes],
					lines: [...branch1.lines, ...branch2.lines]
				};

				break;
			case NodeEnum.Loop:
			case NodeEnum.Branch:
				actNode.isGroup = true;
				groupKey = actNode.key;

				let open = NodeStore.getNode(NodeEnum.SubOpen, groupKey);
				let close = NodeStore.getNode(NodeEnum.SubClose, groupKey);
				let guide = NodeStore.getNode(NodeEnum.WFGuideNode, groupKey);
				open.type = NodeEnum.SubOpen;
				close.type = NodeEnum.SubClose;
				guide.type = NodeEnum.WFGuideNode;

				d = {
					nodes: [actNode, open, guide, close],
					lines: [
						LineStore.getLink(open.key, guide.key, groupKey),
						LineStore.getLink(guide.key, close.key, groupKey)
					]
				};
				break;
			default:
				d = {
					...d,
					nodes: [actNode]
				};
				break;
		}

		// d.nodes[0].type = nodeEnmu;
		return d;
	};
}
