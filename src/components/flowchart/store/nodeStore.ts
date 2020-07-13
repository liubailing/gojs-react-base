import { NodeEnum, DiagramEnum } from '../enum';
import { INodeModel } from '../interface';
import { DiagramSetting } from '../config';

/**
 * 得到节点展示的类型
 * @param fcType
 */
export class NodeStore {
	static strCondition = '判断条件'; //lang.FCEntities.Condition;
	static strExtractData = '提取数据'; //lang.FCEntities.ExtractData;
	static strComplete = '结束流程'; //lang.FCEntities.Complete;
	static strEnterText = '输入文本'; //lang.FCEntities.EnterText;
	static strLoop = '循环'; //lang.FCEntities.Loop;
	static strBreakActivity = '结束循环'; //lang.FCEntities.BreakActivity;
	static strClick = '点击元素'; //lang.FCEntities.Click;
	static strMouseOver = '移动鼠标到元素上'; //lang.FCEntities.MouseOver;
	static strNavigate = '打开网页'; //lang.FCEntities.Navigate;
	static strSwitchCombo = '切换下拉选项'; //lang.FCEntities.SwitchCombo;
	static strEnterCapacha = '识别验证码'; //lang.FCEntities.EnterCapacha;
	static strBranch = '条件分支'; //lang.FCEntities.Branch;
	static strWFGuideNode = '将要执行的流程拖放在此'; //lang.FCEntities.WFGuideNode;

	static getRandomKey = (len: number = 8): string => {
		len = len < 1 ? 8 : len;
		let $chars =
			'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		let maxPos = $chars.length;
		let pwd = '';
		for (let i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	};

	static get baseModel(): INodeModel {
		let n: INodeModel = {
			type: '',
			group: '',
			label: '',
			key: NodeStore.getRandomKey(),
			isGroup: false,
			// hasChild: false,
			category: '',
			childs: null
		};
		return n;
	}

	static getNode = (fcType: string, group: string = ''): INodeModel => {
		let node: INodeModel = NodeStore.baseModel;
		// this.fcType = type;
		let title = '';
		// let src = '';
		let isGroup = false;
		switch (fcType as string) {
			case NodeEnum.Condition:
				title = NodeStore.strCondition; // lang.FCEntities.Condition;
				// src = 'condition';
				isGroup = true;
				break;
			case NodeEnum.ExtractData:
				title = NodeStore.strExtractData; //lang.FCEntities.ExtractData;
				// src = 'data';
				break;
			case NodeEnum.Complete:
				title = NodeStore.strComplete; //lang.FCEntities.Complete;
				// src = 'subend';
				break;
			case NodeEnum.EnterText:
				title = NodeStore.strEnterText; //lang.FCEntities.EnterText;
				// src = 'input';
				break;
			case NodeEnum.Loop:
				title = NodeStore.strLoop; //lang.FCEntities.Loop;
				// src = 'loop';
				isGroup = true;
				break;
			case NodeEnum.BreakActivity:
				title = NodeStore.strBreakActivity; //lang.FCEntities.BreakActivity;
				// src = 'loopbreak';
				break;
			case NodeEnum.Click:
				title = NodeStore.strClick; //lang.FCEntities.Click;
				// src = 'mouseclick';
				break;
			case NodeEnum.MouseOver:
				title = NodeStore.strMouseOver; //lang.FCEntities.MouseOver;
				// src = 'mousehover';
				break;
			case NodeEnum.Navigate:
				title = NodeStore.strNavigate; //lang.FCEntities.Navigate;
				// src = 'openweb';
				break;
			case NodeEnum.SwitchCombo:
				title = NodeStore.strSwitchCombo; // lang.FCEntities.SwitchCombo;
				// src = 'switch';
				break;
			case NodeEnum.EnterCapacha:
				title = NodeStore.strEnterCapacha; //lang.FCEntities.EnterCapacha;
				// src = 'verify';
				break;
			case NodeEnum.Branch:
				title = NodeStore.strBranch; //lang.FCEntities.Branch;
				isGroup = true;
				break;
			case NodeEnum.WFGuideNode:
				title = NodeStore.strWFGuideNode; //lang.FCEntities.WFGuideNode;
				break;
			default:
				break;
		}

		node.label = title;
		// node.src = src;
		node.isGroup = isGroup;
		node.sortIndex = 0;

		if (!group) {
			group = 'root';
		}
		node.group = group;
		node.category = NodeStore.getDiagramEnum(fcType);
		node.type = fcType as NodeEnum;
		//
		// 特殊点处理
		switch (fcType) {
			case NodeEnum.Start:
				node.key = 'start';
				break;
			case NodeEnum.SubOpen:
				node.key = `${node.group}${DiagramSetting.keyStart}`;
				break;
			case NodeEnum.SubClose:
				node.key = `${node.group}${DiagramSetting.keyEnd}`;
				break;
			case NodeEnum.WFGuideNode:
				node.key = `${node.group}${DiagramSetting.keyTip}`;
				break;
			case NodeEnum.End:
				node.key = 'end';
				break;
			default:
				break;
		}
		return node;
	};

	static getDiagramEnum = (fcType: string): DiagramEnum => {
		let cate = DiagramEnum.FCNode;
		switch (fcType) {
			case NodeEnum.ExtractData:
			case NodeEnum.EnterText:
			case NodeEnum.MouseOver:
			case NodeEnum.Click:
			case NodeEnum.Navigate:
			case NodeEnum.SwitchCombo:
			case NodeEnum.EnterCapacha:
				cate = DiagramEnum.FCNode;
				break;
			case NodeEnum.Branch:
				cate = DiagramEnum.ConditionSwitch;
				break;
			case NodeEnum.Loop:
				cate = DiagramEnum.LoopGroup;
				break;
			case NodeEnum.Condition:
				cate = DiagramEnum.ConditionGroup;
				break;
			case NodeEnum.Start:
				cate = DiagramEnum.WFGuideStart;
				break;
			case NodeEnum.End:
				cate = DiagramEnum.WFGuideEnd;
				break;
			case NodeEnum.WFGuideNode:
				cate = DiagramEnum.WFGuideNode;
				break;
			case NodeEnum.SubOpen:
				cate = DiagramEnum.WFGuideSubOpen;
				break;
			case NodeEnum.SubClose:
				cate = DiagramEnum.WFGuideSubClose;
				break;
			case NodeEnum.BreakActivity:
			case NodeEnum.Complete:
				cate = DiagramEnum.StopLoopOrFlow;
				break;
			default:
				cate = DiagramEnum.WFGuideSubClose;
				break;
		}

		return cate;
	};
}

export default NodeStore;
