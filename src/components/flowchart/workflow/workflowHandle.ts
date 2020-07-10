import { IFlowchartHander, INodeModel, ILineModel } from '../interface';
import { HanderFlowchart } from '../handle';
import { observable, computed, action } from 'mobx';
import { NodeEnum } from '../enum';
import { TestData } from './index';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export class WorkflowHandle implements IFlowchartHander {
	constructor() {}
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
				const dataAll = this.flowchart.getAll();
				// this.flowchart.initFlochart(dataAll.nodes, dataAll.lines);
				break;
			case 'hide_contextMenu':
				this.flowchart._hideContextMenu();
				break;
			case 'add_smiple':
				this.flowchart.onAdd2After8NodeId('openJD', NodeEnum.ExtractData);
				break;
			case 'add_loop':
				this.flowchart.onAdd2After8NodeId('openJD', NodeEnum.Loop);
				break;
			case 'add_condition':
				this.flowchart.onAdd2After8NodeId('openJD', NodeEnum.Condition);
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
			default:
				this.log('未实现的操作');
				break;
		}
	};
}

const w = new WorkflowHandle();
export default w;
