import { DiagramModel, NodeModel, LineModel } from '../interface';
import { NodeStore, LineStore } from '../store';
import { NodeEnum } from '../enum';
import { ActionNode, ActionNodeType } from '../workflow/entity';
import TestDataJson from './testData';

/**
 * @class 自定义模式业务
 */
export class TestData {
	currKey: string = '';

	curCount: number = 0;

	/**
	 * 初始化
	 * @param node
	 */
	static getFlowchartData(wfData: boolean = false): DiagramModel<NodeModel, LineModel> {
		let d: DiagramModel<NodeModel, LineModel> = { nodeArray: [], linkArray: [] };

		let start = NodeStore.getNode(NodeEnum.Start);
		let end = NodeStore.getNode(NodeEnum.End);
		let data = TestDataJson;
		d = TestData.doFlowchartData(data, data.childs);
		if (wfData || data.childs.length === 0) {
			d.nodeArray = [start, end];
			d.linkArray = [LineStore.getLink(start.key, end.key, end.group)];
			d.nodeArray.map((x) => {
				x.category = NodeStore.getDiagramEnum(x.type as NodeEnum);
			});
		} else {
			d.linkArray.push(LineStore.getLink(start.key, d.nodeArray[0].key, start.group));
			d.linkArray.push(LineStore.getLink(d.nodeArray[d.nodeArray.length - 1].key, end.key, end.group));
			d.nodeArray.push(start);
			d.nodeArray.push(end);
		}

		return d;
	}

	/**
	 * 工作流数据 -> 流程图数据
	 */
	private static doFlowchartData(parent: ActionNode, childs?: ActionNode[]): DiagramModel<NodeModel, LineModel> {
		let d: DiagramModel<NodeModel, LineModel> = { nodeArray: [], linkArray: [] };
		let nodes: NodeModel[] = [];
		let links: LineModel[] = [];
		switch (parent.type) {
			case ActionNodeType.Condition:
				if (childs) {
					//开始循环数据
					childs.forEach((x, i) => {
						let n = this.getNodeModel(x, parent.key);
						n.label = x.label || n.label;
						n.sortIndex = i;
						nodes.push(n);

						//如果有子集
						let c = TestData.doFlowchartData(x, x.childs);
						d = {
							nodeArray: [...d.nodeArray.slice(0, 1), ...c.nodeArray, ...d.nodeArray.slice(1)],
							linkArray: [...d.linkArray.slice(0, 1), ...c.linkArray, ...d.linkArray.slice(1)]
						};
					});
				}

				break;
			case ActionNodeType.Loop:
			case ActionNodeType.Branch:
				let loopStart = NodeStore.getNode(NodeEnum.SubOpen, parent.key);

				let loopEnd = NodeStore.getNode(NodeEnum.SubClose, parent.key);
				if (childs && childs.length > 0) {
					//开始循环数据
					childs.forEach((x, i) => {
						//2除去头尾
						if (i !== 0 && i !== childs.length) {
							links.push(LineStore.getLink(childs[i - 1].key, childs[i].key, parent.key));
						}

						let n = this.getNodeModel(x, parent.key);
						n.label = x.label || n.label;
						nodes.push(n);

						//如果有子集
						let c = TestData.doFlowchartData(x, x.childs);
						d = {
							nodeArray: [...d.nodeArray.slice(0, 1), ...c.nodeArray, ...d.nodeArray.slice(1)],
							linkArray: [...d.linkArray.slice(0, 1), ...c.linkArray, ...d.linkArray.slice(1)]
						};
					});

					loopStart.group = parent.key;
					loopEnd.group = parent.key;
					links.push(LineStore.getLink(loopStart.key, nodes[0].key, parent.key));
					links.push(LineStore.getLink(nodes[nodes.length - 1].key, loopEnd.key, parent.key));
					nodes.push(loopStart);
					nodes.push(loopEnd);
				} else {
					loopStart.group = parent.key;
					loopEnd.group = parent.key;
					let guide = NodeStore.getNode(NodeEnum.WFGuideNode, parent.key);
					guide.group = parent.key;

					links.push(LineStore.getLink(loopStart.key, guide.key, parent.key));
					links.push(LineStore.getLink(guide.key, loopEnd.key, parent.key));
					nodes.push(loopStart);
					nodes.push(loopEnd);
					nodes.push(guide);
				}
			default:
				if (childs && childs.length > 0) {
					//开始循环数据
					childs.forEach((x, i) => {
						//2除去头尾
						if (i !== 0 && i !== childs.length) {
							links.push(LineStore.getLink(childs[i - 1].key, childs[i].key, parent.key));
						}

						let n = this.getNodeModel(x, parent.key);
						n.label = x.label || n.label;
						nodes.push(n);

						//如果有子集
						let c = TestData.doFlowchartData(x, x.childs);
						d = {
							nodeArray: [...d.nodeArray.slice(0, 1), ...c.nodeArray, ...d.nodeArray.slice(1)],
							linkArray: [...d.linkArray.slice(0, 1), ...c.linkArray, ...d.linkArray.slice(1)]
						};
					});
				}
				break;
		}

		return {
			nodeArray: [...nodes.slice(0, 1), ...d.nodeArray, ...nodes.slice(1)],
			linkArray: [...d.linkArray, ...links]
		};
	}

	//
	private static getNodeModel(node: ActionNode, parentkey: string): NodeModel {
		let f = NodeStore.getNode(node.type);
		let n: NodeModel = {
			type: node.type,
			group: '',
			label: f.label,
			key: node.key,
			category: f.category,
			isGroup: f.isGroup
		};
		return { ...n, ...{ group: parentkey } };
	}
}
