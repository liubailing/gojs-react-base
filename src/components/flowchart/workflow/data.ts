import { DiagramModel, NodeModel, LineModel } from '../interface';
import { FCNode, FCLink } from '../controller';
import { NodeEnum } from '../enum';
import { ActionNode, ActionNodeType } from '../workflow/entity';
import { DiagramSetting } from '../config';

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

		if (wfData) {
			let start = FCNode.getNode(NodeEnum.Start);
			let end = FCNode.getNode(NodeEnum.End);
			d.nodeArray = [start, end];
			d.linkArray = [FCLink.getLink(start.key, end.key, end.group)];

			d.nodeArray.map((x) => {
				x.diagramType = FCNode.getDiagramEnum(x.type as NodeEnum);
			});
		} else {
			let data = TestData.getWorkFlowData();
			d = TestData.doFlowchartData(data, data.childs);
		}

		return d;
	}

	/**
	 * 模拟的工作流的数据
	 */
	static getWorkFlowData(): ActionNode {
		return {
			key: 'root',
			type: 'root',
			childKeys: [],
			childs: [
				{
					key: '打开京东',
					label: 'testtest123',
					type: ActionNodeType.Navigate as string,
					data: { tip: '这是一个node1存值' }
				},
				{
					key: 'cond',
					type: ActionNodeType.Condition as string,
					childs: [
						{
							key: 'branch1-1',
							label: 'MMMMMMMMMMMMMMMMMMMMMMMMM',
							type: ActionNodeType.Branch as string,
							childs: [
								{ key: 'data11-1', type: ActionNodeType.ExtractData as string }
								// { key: 'jd-shouji', label: "打开手机专卖", type: ActionNodeType.Navigate as string },
								// { key: 'data11-2', type: ActionNodeType.ExtractData as string },
							]
						},
						{
							key: 'branch1-2',
							type: ActionNodeType.Branch as string,
							childs: [
								{ key: 'jd-chaoshi', label: '打开生鲜超市', type: ActionNodeType.Navigate as string },
								{ key: 'data12-2', type: ActionNodeType.ExtractData as string }
							]
						},
						{
							key: 'branch1-3',
							type: ActionNodeType.Branch as string
						},
						{
							key: 'branch1-4',
							type: ActionNodeType.Branch as string,
							childs: [
								{ key: 'data16-2', type: ActionNodeType.ExtractData as string },
								{ key: 'jd-lingquan', label: '打开优惠券', type: ActionNodeType.Navigate as string },
								{ key: 'data122-2', type: ActionNodeType.ExtractData as string }
							]
						}
					]
				},
				{ key: 'data00-2', type: ActionNodeType.ExtractData as string, parentKey: 'root' },
				{
					key: 'jd-dingdan',
					label: '打开我的订单',
					type: ActionNodeType.Navigate as string,
					parentKey: 'root'
				},
				{ key: 'data44-2', type: ActionNodeType.ExtractData as string, parentKey: 'root' },
				{
					key: 'loop',
					type: ActionNodeType.Loop as string,
					parentKey: 'root',
					data: { tip: '这是一个loop存值' }
				},
				{
					key: 'loop2',
					label: '循环循环循环循环循环循环循环循环循环循环循环',
					type: ActionNodeType.Loop as string,
					parentKey: 'root',
					childs: [
						{ key: 'data64-3', label: '测试', type: ActionNodeType.ExtractData as string },
						{
							key: 'jd-xunhuna-pages',
							label: '循环翻页循环翻页循环翻页循环翻页循环翻页循环翻页',
							type: ActionNodeType.Navigate as string
						},
						{ key: 'data22-2', type: ActionNodeType.ExtractData as string },
						{ key: 'jd-xunhuan-data', label: '循环提取数据', type: ActionNodeType.Navigate as string },
						{ key: 'data24-3', type: ActionNodeType.ExtractData as string }
					]
				},
				{ key: 'data', type: ActionNodeType.ExtractData as string, parentKey: 'root' }
			]
		};
	}

	/**
	 * 工作流数据 -> 流程图数据
	 */
	private static doFlowchartData(parent: ActionNode, childs?: ActionNode[]): DiagramModel<NodeModel, LineModel> {
		let d: DiagramModel<NodeModel, LineModel> = { nodeArray: [], linkArray: [] };
		// debugger;
		let links: LineModel[] = [];
		let nodes: NodeModel[] = [];

		//最简单得初始化数据
		if (!childs || childs.length < 1) {
			let loopStart = FCNode.getNode(NodeEnum.SubOpen, parent.key);
			loopStart.group = parent.key;
			let loopEnd = FCNode.getNode(NodeEnum.SubClose, parent.key);
			loopEnd.group = parent.key;
			let guide = FCNode.getNode(NodeEnum.WFGuideNode, parent.key);
			guide.group = parent.key;

			links.push(FCLink.getLink(loopStart.key, guide.key, parent.key));
			links.push(FCLink.getLink(guide.key, loopEnd.key, parent.key));
			nodes.push(loopStart);
			nodes.push(loopEnd);
			nodes.push(guide);

			return {
				nodeArray: [...d.nodeArray, ...nodes],
				linkArray: [...d.linkArray, ...links]
			};
		}

		//开始循环数据
		childs.forEach((x, i) => {
			//处理条件分支
			let isBranchAndLayerByGroup = DiagramSetting.branchLayerGroup && parent.type === ActionNodeType.Condition;

			if (i === 0 || i === childs.length) {
			} else {
				//条件分支  不需要线
				if (!isBranchAndLayerByGroup) {
					links.push(
						FCLink.getLink(
							childs[i - 1].key,
							childs[i].key,
							parent.key,
							parent.type === ActionNodeType.Condition
						)
					);
				}
			}

			let n = this.getNodeModel(x, parent.key);

			n.label = x.label || n.label;

			n.sortIndex = i;
			n.isSel = true;
			nodes.push(n);

			switch (x.type) {
				case ActionNodeType.Condition:
				case ActionNodeType.Loop:
				case ActionNodeType.Branch:
					//如果有子集
					let c = TestData.doFlowchartData(x, x.childs);
					d = {
						nodeArray: [...d.nodeArray, ...c.nodeArray],
						linkArray: [...d.linkArray, ...c.linkArray]
					};
					break;
				default:
					break;
			}
		});

		switch (parent.type) {
			case ActionNodeType.Condition:
				//nodes[0].loc = "0,200";
				break;
			case ActionNodeType.Branch:
			// let branchStart = FCNode.getNode(NodeEnum.SubOpen);
			// branchStart.group = parent.key;
			// let branchEnd = FCNode.getNode(NodeEnum.SubClose);
			// branchEnd.group = parent.key;
			// links.push(FCLink.getLink(branchStart.key, nodes[0].key, parent.key));
			// links.push(FCLink.getLink(nodes[nodes.length - 1].key, branchEnd.key, parent.key));
			// nodes.push(branchStart);
			// nodes.push(branchEnd);
			// break;
			case ActionNodeType.Loop:
				let loopStart = FCNode.getNode(NodeEnum.SubOpen, parent.key);
				loopStart.group = parent.key;
				let loopEnd = FCNode.getNode(NodeEnum.SubClose, parent.key);
				loopEnd.group = parent.key;
				links.push(FCLink.getLink(loopStart.key, nodes[0].key, parent.key));
				links.push(FCLink.getLink(nodes[nodes.length - 1].key, loopEnd.key, parent.key));
				nodes.push(loopStart);
				nodes.push(loopEnd);

				break;
			default:
				let start = FCNode.getNode(NodeEnum.Start);
				let end = FCNode.getNode(NodeEnum.End);
				links.push(FCLink.getLink(start.key, nodes[0].key, parent.key));
				links.push(FCLink.getLink(nodes[nodes.length - 1].key, end.key, parent.key));
				nodes.push(start);
				nodes.push(end);
				break;
		}

		return {
			nodeArray: [...d.nodeArray, ...nodes],
			linkArray: [...d.linkArray, ...links]
		};
	}

	//
	private static getNodeModel(node: ActionNode, parentkey: string): NodeModel {
		let f = FCNode.getNode(node.type);
		let n: NodeModel = {
			type: node.type,
			group: '',
			label: f.label,
			isSel: true,
			key: node.key,
			diagramType: f.diagramType,
			isGroup: f.isGroup
		};
		n.category = n.diagramType;
		return { ...n, ...{ group: parentkey } };
	}
}
