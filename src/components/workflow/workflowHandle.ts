import { IFlowchartHander, INodeModel, ILineModel } from '../flowchart/interface';
import { HanderFlowchart } from '../flowchart/handle';
import { observable } from 'mobx';
import { NodeEnum } from '../flowchart/enum';
import { WorkflowHelper } from './index';
import { FlowchartModel } from '../flowchart/model';
import TestDataJson from './testData';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
export class WorkflowHandle implements IFlowchartHander {
	flowchart: HanderFlowchart;
	constructor(taskId: string) {
		this.taskId = taskId;
		this.flowchart = new HanderFlowchart(this);
	}
	@observable logs: string[] = [];
	@observable taskId = '';

	/**
	 * 流程图上当前操作操作的key
	 * 目前的三种情况
	 * 1，显示线上添加流程图菜单时preNodekey
	 * 2，点菜单时候nodekey
	 * 3，循环详情时候nodekey
	 */
	currentActionNodeKey: string = '';
	/** 0：关闭不显示 1：显示添加节点 2：点操作 3：loopInfo */
	@observable currentNodeMenuShowType: number = 0;
	/** X坐标 */
	@observable currentNodeMenuPosX: number = 0;
	/** Y坐标 */
	@observable currentNodeMenuPosY: number = 0;

	/** 流程图完成第一次加载 */
	@observable flowChartHasInited: boolean = false;

	/******************************
	 *
	 ******************************/

	/**
	 * 点击节点
	 * @param node 节点数据
	 */
	handlerClickNode(node: INodeModel): void {
		this.log(`handler -click ${node.key}`);
		const data = this.flowchart.onGetNodeNavigateKey(node.key) || '';
		console.log(`handler -click data`, data);
	}

	handlerClickNodeAgain(node: INodeModel): void {
		const loopKey = this.flowchart.onGetNodeLoopKey(node.key) || '';

		this.log(`handler -clickagin loop ${loopKey}`);
	}

	handlerDeleteNode(currKey: string, deleteKey: string) {
		this.log(`handler -delete ${currKey}, ${deleteKey}`);
	}

	/**
	 * 节点增加后 触发事件
	 */
	handlerAddNode(node: INodeModel, isDrag: boolean) {
		this.log(`handler -add ${node.key}, ${isDrag}`);
	}

	handlerShowEditNodeName(currName: string, currNodeKey: string) {
		this.log(`handler -show edit name ${currName}, ${currNodeKey}`);
	}

	handlerSaveNodeName(newName: string) {
		this.log(`handler -save name ${newName}`);
	}

	handlerShowLoopInfo(nodedata: any, value: any, option: any) {
		this.log(`handler -show loop info ${option}`);
	}

	/**
	 * 流程改变后 触发事件
	 * todo 还需完善
	 */
	handlerChanged(): void {
		this.log(`handler -change`);
	}

	handlerWillCopy(): void {
		this.log(`handler -will copy`);
	}

	handlerPaste(currNodeKey: string): void {
		this.log(`handler -Paste ${currNodeKey}`);
	}

	handlerDrag(currNodeKey: string): void {
		this.log(`handler -Drag ${currNodeKey}`);
	}

	handlerTip(tipType: string): void {
		this.log(`handler -Error ${tipType}`);
	}

	handlerInit() {
		this.log(`handler -init `);
	}

	handlerHoverNodeInfo(nodedata: any) {
		this.log(`handler -弃用 nodeinfo `);
	}

	handlerGetNodeData() {
		this.log(`handler -getNodeData `);
	}

	// --------------

	/**
	 * 显示点-设置面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeSetting(node: INodeModel, posX: number, posY: number): void {
		this.log(`Show NodeSetting,${posX},${posY},${node.label}`);
	}

	/**
	 * 显示点-菜单面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeMenu(node: INodeModel, posX: number, posY: number): void {
		this.currentActionNodeKey = node.key;
		this.currentNodeMenuPosX = posX - 100;
		this.currentNodeMenuPosY = posY;
		this.currentNodeMenuShowType = 2;
		this.log(`Show NodeMenu,${posX},${posY},${node.label}`);
	}

	/** 隐藏节点菜单 */
	handlerHideNodeMenu(): void {
		this.currentActionNodeKey = '';
		this.currentNodeMenuPosX = 0;
		this.currentNodeMenuPosY = 0;
		this.currentNodeMenuShowType = 0;
		this.log(`hide NodeSetting`);
	}

	/**
	 * 显示点-信息面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeInfo(node: INodeModel, posX: number, posY: number): void {
		this.currentActionNodeKey = node.key;
		this.log(`Show NodeInfo,${posX},${posY},${node.label}`);
	}

	/** 隐藏信息面板 */
	handlerHideNodeInfo(): void {
		this.currentActionNodeKey = '';
		this.currentNodeMenuPosX = 0;
		this.currentNodeMenuPosY = 0;
		this.currentNodeMenuShowType = 0;
		this.log(`hide NodeInfo`);
	}

	/**
	 * 显示点-菜单面板
	 * @param line 线信息
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowLineMenu(line: ILineModel, posX: number, posY: number): void {
		this.currentActionNodeKey = line.to;
		this.currentNodeMenuPosX = posX - 70;
		this.currentNodeMenuPosY = posY;
		this.currentNodeMenuShowType = 1;
		this.log(`Show LineMenu,${posX},${posY},${line.from}`);
	}

	/** 隐藏线面板 */
	handlerHideLineMenu(): void {
		this.currentNodeMenuShowType = 0;
		this.log(`handler hide Line`);
	}

	/**
	 * 隐藏 弹层信息
	 * */
	handlerHideModal(): void {
		this.hideModal();
	}

	private hideModal() {
		this.currentActionNodeKey = '';
		this.currentNodeMenuPosX = 0;
		this.currentNodeMenuPosY = 0;
		this.currentNodeMenuShowType = 0;
	}

	/**
	 * 优化掉
	 * 流程图对外回调接口，
	 * 显示节点编辑页面
	 */
	onShowEditPage() {
		this.log(`handler -onShowEditPage`);
	}

	// @action
	log(str: string) {
		this.logs.push(str);
	}
	/**
	 * 流程图失去焦点
	 */
	handlerLostFocus(): void {}

	/**
	 * 流程图点击空白处
	 */
	handlerClickBackground(): void {}

	/**
	 * 右键节点
	 */
	handlerRightClickNode(node: INodeModel, posX: number, posY: number): void {
		this.currentActionNodeKey = node.key;
		this.currentNodeMenuPosX = posX - 100;
		this.currentNodeMenuPosY = posY;
		this.currentNodeMenuShowType = 2;
		this.log(`Show NodeMenu,${posX},${posY},${node.label}`);
	}

	/**
	 * 流程图渲染变化
	 */
	handlerViewChanged(): void {
		// this.hideModal();
	}

	/**
	 * 鼠标移入
	 * 目前只有loop放开有这个事件
	 */
	handlerMouseEnter(node: INodeModel): void {
		this.flowchart.onSetNodeListActionVisible(node.key);
	}

	/**
	 * 点击了出节点以外的对象，但是不包括背景
	 */
	handlerClickExcludeNode(): void {}

	private resetData(thisItme: FlowchartModel, parentNode: INodeModel | null = null): any {
		let parentKey = 'root';
		if (parentNode !== null && Object.keys(parentNode).length > 2) {
			parentKey = parentNode.key;
		}

		let resData = {
			...{
				type: parentNode ? parentNode.type : '',
				parentKey: parentNode ? parentNode.group : ''
			},
			...{
				key: parentKey,
				data: this.flowchart.onGetNodeData(parentKey, false),
				childKeys: this.flowchart.onGetNodeChildKeys(parentKey),
				childs: []
			}
		};

		let item = thisItme._header.next;

		while (item !== thisItme._tail) {
			let res = {
				key: item.value.key,
				type: item.value.type,
				parentKey: item.value.group,
				data: null,
				childKeys: null,
				childs: null
			};

			if (thisItme.hasChildsNodeType.includes(item.value.type as NodeEnum) && item.value.childs) {
				res = this.resetData(item.value.childs, item.value);
			}

			if (!thisItme.guidNodeType.includes(item.value.type as NodeEnum)) {
				res.data = this.flowchart.onGetNodeData(item.value.key, false) as any;
				resData.childs.push(res as never);
			}
			// 下一轮循环
			item = item.next;
		}

		return resData;
	}

	tempActionData: any = null;
	test = (action: string) => {
		let addKey = '';
		switch (action) {
			case 'render':
				const redata = WorkflowHelper.getFlowchartData(TestDataJson);
				this.flowchart.init(redata);
				break;
			case 'init':
				const data = WorkflowHelper.getFlowchartData({});
				this.flowchart.init(data);
				break;
			case 'rerender':
				const newdata = WorkflowHelper.getFlowchartData(this.tempActionData);
				this.flowchart.init(newdata);
				break;
			case 'getall':
				const flData = this.flowchart.onGetAll();
				this.tempActionData = this.resetData(flData);
				break;
			case 'hide_contextMenu':
				this.hideModal();
				break;
			case 'add_smiple':
				let openJD = this.flowchart.onGetNode(`openJD`);

				if (openJD && openJD.key) {
					addKey = this.flowchart.onAdd2Next8NodeId('openJD', NodeEnum.ExtractData);
				} else {
					addKey = this.flowchart.onAdd2Next8NodeId('', NodeEnum.ExtractData);
				}
				if (addKey) {
					this.flowchart.onSetNodeSelected(addKey);
				}
				break;
			case 'add_loop':
				this.flowchart.onAdd2Next8NodeId('openJD', NodeEnum.Loop);
				break;
			case 'add_condition':
				this.flowchart.onAdd2Next8NodeId('openJD', NodeEnum.Condition);
				break;
			case 'add_pre':
				this.flowchart.onAdd2Pre8NodeId('openJD', NodeEnum.EnterText);
				break;
			case 'add_inner_cond':
				this.flowchart.onAdd2InnerTail8NodeId('cond', NodeEnum.Branch);
				break;
			case 'add_inner_branch':
				this.flowchart.onAdd2InnerTail8NodeId('branch1-1', NodeEnum.Loop);
				break;
			case 'add_inner_loop':
				this.flowchart.onAdd2InnerTail8NodeId('loop', NodeEnum.Condition);
				break;
			case 'add_inner_loop_tail':
				this.flowchart.onAdd2InnerTail8NodeId('loop2', NodeEnum.Navigate);
				break;
			case 'add_inner_loop_header':
				this.flowchart.onAdd2InnerHeader8NodeId('loop2', NodeEnum.Navigate);
				break;
			case 'add_inner_cond_header':
				this.flowchart.onAdd2InnerHeader8NodeId('cond', NodeEnum.Branch);
				break;
			case 'add_cond_loop':
				this.flowchart.onAdd2InnerLoop8NodeId('openJD');
				break;
			case 'delete_loop2':
				this.flowchart.onRemoveNode('loop2');
				break;
			case 'delete_cond':
				this.flowchart.onRemoveNode('cond');
				break;
			case 'delete_branch':
				this.flowchart.onRemoveNode('branch1-2');
				break;
			case 'delete_data':
				this.flowchart.onRemoveNode('data11-1');
				break;
			case 'set_data':
				this.flowchart.onSetNodeData('openJD', { title: '这是一个测试数据' });
				this.logs.push(`openJD 存数据`);
				break;
			case 'get_data':
				let data1: any = this.flowchart.onGetNodeData('openJD');
				if (data1) {
					this.logs.push(`获取 openJD :` + data1.tip, data1.title);
				}
				break;
			case 'set_data_1':
				this.flowchart.onSetNodeData('openJD', { title: '修改了测试数据' });
				this.logs.push(`openJD 再存数据`);
				break;
			case 'sel_node':
				this.flowchart.onSetNodeSelected('openJD');
				this.logs.push(`选中 openJD`);
				break;
			case 'sel_loop':
				this.flowchart.onSetNodeSelected('loop');
				this.logs.push(`选中 循环`);
				break;
			case 'sel_branch2':
				this.flowchart.onSetNodeSelected('branch1-2');
				this.logs.push(`选中 分支2`);
				break;
			case 'sel_cond':
				this.flowchart.onSetNodeSelected('cond');
				this.logs.push(`选中 条件`);
				break;
			case 'sel_node_only':
				this.flowchart.onSetNodeSelected('openJD', false);
				this.logs.push(`只选中 不触发click`);
				break;
			case 'rename':
				this.flowchart.onRename('openJD', '重新命名');
				this.logs.push(`重新命名 openJD`);
				break;
			case 'get_node':
				let node = this.flowchart.onGetNode('openJD');
				if (node) {
					this.logs.push(`得到数据 openJD:` + JSON.stringify(node));
				}
				break;
			case 'get_cond':
				let cond = this.flowchart.onGetNode('loop2');
				if (cond) {
					this.logs.push(`得到数据 cond:` + JSON.stringify(cond));
				}
				break;
			case 'copy_cond':
				this.flowchart.onCopyNode('cond', true);
				break;
			case 'copy_cond2':
				this.flowchart.onCopyNode('cond');
				break;
			case 'paste_to_loop':
				this.flowchart.onPaste2Node('loop');
				break;
			case 'copy_paste':
				this.flowchart.onCopyNode2PasteNode('cond', 'loop');
				break;
			case 'copy_paste2':
				this.flowchart.onCopyNode2PasteNode('cond', 'loop2');
				break;
			default:
				this.log('未实现的操作');
				break;
		}
	};
}

export default WorkflowHandle;
