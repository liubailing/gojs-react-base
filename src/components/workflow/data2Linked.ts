import { INodeModel } from '../flowchart/interface';
import { NodeStore } from '../flowchart/store';
import { FlowchartModel } from '../flowchart/model';
import { NodeEnum } from '../flowchart/enum';
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
	static getFlowchartData(wfData: boolean = false): FlowchartModel {
		let d: FlowchartModel = new FlowchartModel();

		let start = NodeStore.getNode(NodeEnum.Start);
		let end = NodeStore.getNode(NodeEnum.End);
		let data = TestDataJson;

		d.add(start);

		if (!wfData && data.childs.length > 0) {
			data.childs.forEach((x) => {
				let n = this.getNodeModel(x, 'root');
				n.label = x.label || n.label;
				n.childs = this.doFlowchartData(n, x.childs);
				d.add(n);
			});
		}

		d.add(end);
		// let dd = d.toDiagram();
		return d;
	}

	/**
	 * 工作流数据 -> 流程图数据
	 */
	private static doFlowchartData(parent: INodeModel, childs?: ActionNode[]): FlowchartModel {
		let dlist: FlowchartModel = new FlowchartModel();

		switch (parent.type) {
			case ActionNodeType.Condition:
				if (childs) {
					//开始循环分支
					childs.forEach((x, i) => {
						let n = this.getNodeModel(x, parent.key);
						n.label = x.label || n.label;
						n.sortIndex = i;
						n.childs = TestData.doFlowchartData(n, x.childs);
						dlist.add(n);
					});
				}

				break;
			case ActionNodeType.Loop:
			case ActionNodeType.Branch:
				// let loopStart = NodeStore.getNode(NodeEnum.SubOpen, parent.key);
				let currChilds: Array<ActionNode> = [];

				// 头结点
				currChilds.push({
					key: 'start' + parent.key,
					label: '',
					type: NodeEnum.SubOpen,
					parentKey: parent.key
				});

				// 追加进来
				if (childs && childs.length > 0) {
					currChilds = [...currChilds, ...childs];
				} else {
					// 提示节点
					currChilds.push({
						key: 'guid' + parent.key,
						label: '',
						type: NodeEnum.WFGuideNode,
						parentKey: parent.key
					});
				}

				// 结尾
				currChilds.push({
					key: 'end' + parent.key,
					label: '',
					type: NodeEnum.SubClose,
					parentKey: parent.key
				});

				//开始循环数据
				currChilds.forEach((x, i) => {
					let n = this.getNodeModel(x, parent.key);
					n.label = x.label || n.label;

					//如果有子集
					if (x.childs && x.childs.length > 0) {
						n.childs = TestData.doFlowchartData(n, x.childs);
					}
					dlist.add(n);
				});
				break;
			default:
				break;
		}

		return dlist;
	}

	//
	private static getNodeModel(node: ActionNode, parentkey: string): INodeModel {
		let f = NodeStore.getNode(node.type, parentkey);
		let n: INodeModel = {
			type: node.type,
			group: '',
			label: f.label,
			key: node.key,
			category: f.category,
			isGroup: f.isGroup,
			childs: null
		};
		return { ...n, ...{ group: parentkey } };
	}
}
