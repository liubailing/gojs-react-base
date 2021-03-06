import go, { GraphObject } from 'gojs';
import { DiagramEnum } from '../enum';

export default class Base {
	SwitchingLoopTerm: string = '切换循环选项'; //  lang.FlowchartDiagram.SwitchingLoopTerm
	OpenStepSet: string = '打开步骤设置，也可以双击步骤打开'; //  lang.FlowchartDiagram.OpenStepSet
	ForMoreMenus: string = '更多菜单，也可右键点击步骤'; //lang.FlowchartDiagram.ForMoreMenus

	/**
	 * 单击
	 */
	onClick = (_e: go.InputEvent, _obj?: GraphObject): void => {
		try {
			// todo 13
			// if (_obj) {
			// 	//点击在已知节点上
			// 	let node = (_obj as any).part;
			// 	if (node && node.part && node.part.data && node.part.data.key) {
			// 		if (node.part.data.key !== this.props.store.currNodeKey) {
			// 			this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
			// 			this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 			this.props.store.currNodeKey = node.part.data.key;
			// 		}
			// 	}
			// } else {
			// 	//点击在未知节点上
			// 	if (this.props.store.currNodeKey == '') return; //重复点击在未知节点上 直接返回
			// 	this.props.store.diagram.clearSelection();
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
			// 	this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
			// 	this.props.store.currNodeKey = '';
			// }
		} catch (e) {}
	};

	/**
	 * 鼠标移出隐藏
	 */
	private onMouseLeaveTitle = (_val: any, _obj: any): void => {
		this.hideTitle();
	};

	/**
	 * 鼠标移入显示全名val
	 */
	onMouseEnterTitle = (_val: any, _obj: any): void => {
		// let node = (_obj as any).part;
		// todo 12
		// if (!this.props.store.contextMenuIsShow && !this.props.store.loopInfoListIsShow) {
		// 	if (typeof _val != 'string') {
		// 		if (node.data && node.data.label) {
		// 			let { len } = this.gbLenght(node.data.label);
		// 			if (len < 20) {
		// 				return;
		// 			} else {
		// 				this.changeNodeInfoOpacity(0);
		// 			}
		// 		}
		// 	} else {
		// 		this.changeNodeInfoOpacity(0);
		// 	}
		// }
	};

	/**
	 * 鼠标移入设置图标切换
	 */
	onmouseEnterSetHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.onMouseEnterTitle(this.OpenStepSet, _obj);

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = false;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = true;
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移出设置图标切换
	 */
	onmouseLeaveSetHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.hideTitle();

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Iset');
					if (set) set.visible = true;
					let setting = node.findObject('node_Iset_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移入更多菜单图标切换
	 */
	onmouseEnterMenuHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.onMouseEnterTitle(this.ForMoreMenus, _obj);
				let node = (_obj as any).part;
				if (node) {
					let menu = node.findObject('node_Imenu');
					if (menu) {
						menu.visible = false;
					}
					let menuHover = node.findObject('node_Imenu_Hover');
					if (menuHover) {
						menuHover.visible = true;
					}
				}
			}
		} catch (e) {}
	};

	/**
	 * 鼠标移出更多菜单图标切换
	 */
	onmouseLeaveMenuHandler = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				this.hideTitle();

				let node = (_obj as any).part;
				if (node) {
					let set = node.findObject('node_Imenu');
					if (set) set.visible = true;
					let setting = node.findObject('node_Imenu_Hover');
					if (setting) setting.visible = false;
				}
			}
		} catch (e) {}
	};

	/**
	 *
	 */
	onSettingClick = (e: go.InputEvent, obj: GraphObject): void => {
		// todo 20
		// this.props.store.onShowEditPageHandler();
	};

	/**
	 * 点击更多菜单（流程图上面的三个点按钮）,此方法用于显示更多菜单并定位
	 */
	onContextClick = (_e: go.InputEvent, _obj: GraphObject): void => {
		// todo 21
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// this.hideNodeInfo();
		// this.hideTitle();
		// this.hideLoopInfo();
		// let contextMenuEl = document.getElementsByClassName(this.props.store.domIdcontextMenu)[0] as HTMLElement | null;
		// if (contextMenuEl) {
		// 	contextMenuEl.style.display = 'block';
		// 	let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// 	contextMenuEl.style.left = mousePt.x - 90 + 'px';
		// 	contextMenuEl.style.top = mousePt.y + 'px';
		// 	this.props.store.contextMenuIsShow = true;
		// }
	};

	/**
	 *
	 */
	mouseLeaveHandler(_e: go.InputEvent, obj: GraphObject): void {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 17
			//this.props.store._setNodeCss(node, 'mouseLeave');
		}
		// this.hideNodeInfo();
		// this.hideTitle();
		// this.hideLoopInfo();
		// this.hideContextMenu();

		// todo 18
		// if (node && node.part && node.part.data && node.part.data.key === this.props.store.currNodeKey) {
		// 	return;
		// }
		// if (node && node.diagram) {
		// 	this.props.store._setNodeCss(node);
		// }
		// if (node && node.diagram) {
		// 	this.props.store.setLinkShowAdd2(node);
		// }
	}

	/**
	 * 点击加号增加节点
	 */
	onAddNodeClick = (_e: go.InputEvent, _obj: GraphObject): void => {
		// todo 23
		// this.props.store.contextNodeKey = (_obj as any).part.data.key;
		// let addNodeMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.addNodeMenu
		// )[0] as HTMLElement | null;
		// if (addNodeMenuEl) {
		// 	addNodeMenuEl.style.display = 'block';
		// 	let mousePt = this.props.store.diagram.lastInput.viewPoint;
		// 	addNodeMenuEl.style.left = mousePt.x - 75 + 'px';
		// 	addNodeMenuEl.style.top = mousePt.y + 'px';
		// 	let point = this.props.store.diagram.transformViewToDoc(new go.Point(mousePt.x, mousePt.y));
		// 	this.props.store.addPointNode = this.props.store.diagram.findPartAt(point, true);
		// }
	};

	/**
	 * 鼠标移上
	 * @param e
	 * @param obj
	 */
	mouseEnterHandler(_e: go.InputEvent, obj: GraphObject): void {
		// let node = (obj as any).part;
		// debugger;
		//todo 16
		// if (node && node.diagram) {
		// 	if (node.data.type == 'LoopAction') {
		// 		let nodeData = this.props.store.iFlowchart.onNodeDataHandler(node.data);
		// 		if ((nodeData as any).LoopType == 'FixedItem') {
		// 			this.props.store._setNodeCss(node, 'mouseEnter', false);
		// 		} else {
		// 			this.props.store._setNodeCss(node, 'mouseEnter');
		// 		}
		// 	} else {
		// 		this.props.store._setNodeCss(node, 'mouseEnter');
		// 	}
		// }
		// if (node && node.diagram) {
		// 	this.props.store.setLinkShowAdd2(node, 'hover');
		// }
		// this.props.store.contextNodeKey = (obj as any).part.data.key;
		// if (node && node.data && node.data.diagramType == DiagramEnum.WFLink) {
		// 	return;
		// }
		// this.hideContextMenu();
		// this.hideAddNodeMenu();
		// //结束循环，结束流程两种节点类型不显示节点信息提示
		// if (node.data.diagramType != DiagramEnum.StopLoopOrFlow) {
		// }
	}

	/**
	 * 切换选中
	 * @param node
	 */
	onselectionChangedHandler = (node: any) => {
		/** 点击无效区域 */
		if (!node || !node.data || node.data.isSel === undefined) {
			return;
		}
		node.data.isSel = node.isSelected;
		// this.hideContextMenu();
		// this.hideAddNodeMenu();
		// todo 14
		// this.props.store.addNodeMenuLen = HalfNodeMenu;

		// if (_node && _node.data && _node.data.isSel !== undefined) {
		// 	return;
		// }
		// if (_node && _node.diagram) {
		// 	// todo 15
		// 	if (_node.isSelected) {
		// 		// this.props.store.callbackFunc.add(CallbackFuncEnum.Select);
		// 		// this.props.store.callbackFunc.add(CallbackFuncEnum.Click);
		// 		// // this.props.store.preSelectedNodeKey = _node.key;
		// 		// this.props.store.currNodeKey = _node.key;
		// 		// this.props.store._reSetSelected();
		// 	} else {
		// 		// this.props.store.diagram.clearSelection();
		// 		// this.props.store.preSelectedNodeKey.add(_node.key);
		// 		//this.props.store.setNodeCss(_node);
		// 	}
		// }
	};

	/**
	 * 鼠标 拖拽移上
	 * @param e
	 * @param obj
	 */
	mouseDragEnterHandler = (_e: go.InputEvent, obj: GraphObject): void => {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 19
			// this.props.store._setLinkCss(node, 'drag');
		}
	};

	/**
	 * 鼠标 拖拽移开
	 * @param e
	 * @param obj
	 */
	mouseDragLeaveHandler = (_e: go.InputEvent, obj: GraphObject, _obj1: GraphObject): void => {
		let node = (obj as any).part;
		if (node && node.diagram) {
			// todo 20
			// this.props.store._setLinkCss(node);
		}
	};

	hideTitle = () => {};

	/**
	 *
	 */
	hideContextMenu = (): void => {
		// let contextMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.domIdcontextMenu
		// )[0] as HTMLElement | null;
		// if (contextMenuEl) {
		// 	contextMenuEl.style.display = 'none';
		// 	this.props.store.contextMenuIsShow = false;
		// }
	};

	/**
	 *
	 */
	private hideAddNodeMenu(): void {
		// let addNodeMenuEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.addNodeMenu
		// )[0] as HTMLElement | null;
		// if (addNodeMenuEl) {
		// 	addNodeMenuEl.style.display = 'none';
		// }
	}

	/**
	 *
	 */
	private hideNodeInfo(): void {
		// let nodeInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getNodeInfo
		// )[0] as HTMLElement | null;
		// if (nodeInfoEl) {
		// 	nodeInfoEl.style.display = 'none';
		// }
	}

	/**
	 *
	 */
	private hideLoopInfo(): void {
		// let loopInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getLoopInfo
		// )[0] as HTMLElement | null;
		// if (loopInfoEl) {
		// 	// loopInfoEl.style.display = "none";
		// 	loopInfoEl.style.left = '99999px';
		// 	this.props.store.loopInfoListIsShow = false;
		// }
	}

	/**
	 *
	 */
	private changeNodeInfoOpacity(n: number): void {
		// let nodeInfoEl: HTMLElement | null = document.getElementsByClassName(
		// 	this.props.store.getNodeInfo
		// )[0] as HTMLElement | null;
		// if (nodeInfoEl) {
		// 	nodeInfoEl.style.opacity = `${n}`;
		// }
	}
}
