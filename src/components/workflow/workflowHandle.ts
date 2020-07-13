import { IFlowchartHander, INodeModel, ILineModel } from '../flowchart/interface';
import { HanderFlowchart } from '../flowchart/handle';
import { observable, action } from 'mobx';
import { NodeEnum } from '../flowchart/enum';
import { TestData } from './index';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
export class WorkflowHandle implements IFlowchartHander {
	@observable logs: string[] = [];
	taskId = 'cCDWC12344';
	flowchart: HanderFlowchart = new HanderFlowchart(this);

	/******************************
	 *
	 ******************************/
	/** 点击节点 */

	/**
	 * 点击信息
	 * @param node 节点数据
	 */
	handlerClickNode(node: INodeModel): void {
		this.log(`-click ${node.key}`);
	}

	/**
	 * 节点增加后 触发事件
	 */
	handlerAddNodeCallBack(node: INodeModel): void {}

	/**
	 * 流程改变后 触发事件
	 */
	handlerChangedCallBack(): void {}

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
		this.showContent('div-actions', posX, posY);
		this.log(`Show NodeMenu,${posX},${posY},${node.label}`);
	}

	/** 隐藏节点菜单 */
	handlerHideNodeMenu(): void {
		this.log(`hide NodeSetting`);
	}

	/**
	 * 显示点-信息面板
	 * @param node 节点数据
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowNodeInfo(node: INodeModel, posX: number, posY: number): void {
		this.showContent('div-actions', posX, posY);
		this.log(`Show NodeInfo,${posX},${posY},${node.label}`);
	}

	/** 隐藏信息面板 */
	handlerHideNodeInfo(): void {
		this.HideContent();
		this.log(`hide NodeInfo`);
	}

	/**
	 * 显示点-菜单面板
	 * @param line 线信息
	 * @param posX x 坐标
	 * @param posY y 坐标
	 */
	handlerShowLineMenu(line: ILineModel, posX: number, posY: number): void {
		this.showContent('div-actions', posX, posY);
		this.log(`Show LineMenu,${posX},${posY},${line.from}`);
	}

	/** 隐藏线面板 */
	handlerHideLineMenu(): void {
		this.log(`hide Line`);
		this.HideContent();
	}

	/**
	 * 隐藏 右键菜单
	 * 已经是回调函数，不要去调用 onHideContextMenu
	 * */
	handlerHideContextMenu(): void {
		this.HideContent();
		this.log(`hide ContextMenu`);
	}

	@action
	log(str: string) {
		this.logs.push(str);
	}

	private showContent(domId: string, posX: number, posY: number) {
		let contextMenuDIV = document.getElementById(this.taskId);
		if (!contextMenuDIV) {
			contextMenuDIV = document.createElement('div');
			contextMenuDIV.id = this.taskId;
			contextMenuDIV.className = 'div-flowchart-contextMenu';
		}
		contextMenuDIV.innerHTML = '';
		// Show only the relevant buttons given the current state.
		let contextMen = document.getElementById(domId)?.cloneNode(true);

		if (contextMen) contextMenuDIV.appendChild(contextMen);
		contextMenuDIV.style.left = posX - 10 + 'px'; //因为offsetLeft是只读属性所以要通过left属性设置。而且还要设置绝对定位。
		contextMenuDIV.style.top = posY + 20 + 'px'; //
		contextMenuDIV.style.display = 'block';
		document.body.appendChild(contextMenuDIV);
	}

	private HideContent() {
		let contextMenuDIV = document.getElementById(this.taskId);

		if (contextMenuDIV) {
			contextMenuDIV.style.display = 'none';
			contextMenuDIV.innerHTML = '';
		}
	}

	isSimpleData: boolean = true;
	test = (action: string) => {
		switch (action) {
			case 'init':
				this.isSimpleData = !this.isSimpleData;
				const data = TestData.getFlowchartData(this.isSimpleData);
				this.flowchart.initFlochart(data);
				break;
			case 'getall':
				break;
			case 'hide_contextMenu':
				this.flowchart._hideContextMenu();
				break;
			case 'add_smiple':
				this.flowchart.onAdd2Next8NodeId('openJD', NodeEnum.ExtractData);
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
					this.logs.push(`获取 openJD :` + data1.title);
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
				this.flowchart.onCopyNode2Node('cond', 'loop');
				break;
			default:
				this.log('未实现的操作');
				break;
		}
	};
}

const w = new WorkflowHandle();
export default w;
