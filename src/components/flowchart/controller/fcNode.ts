import { NodeEnum, DiagramEnum } from '../enum';
import { NodeModel } from '../interface';
import { DiagramSetting } from '../config';

/**
 * 得到节点展示的类型
 * @param fcType
 */
export class FCNode {
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

	private static getRandomKey = (len: number = 8): string => {
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

	static get baseModel(): NodeModel {
		let n: NodeModel = {
			type: '',
			group: '',
			label: '',
			isSel: false,
			key: FCNode.getRandomKey(),
			isGroup: false,
			// hasChild: false,
			opacity: 0
		};
		n.category = n.diagramType;
		return n;
	}

	static getNode = (fcType: string, group: string = ''): NodeModel => {
		let node: NodeModel = FCNode.baseModel;
		// this.fcType = type;
		let title = '';
		// let src = '';
		let isGroup = false;
		switch (fcType as string) {
			case NodeEnum.Condition:
				title = FCNode.strCondition; // lang.FCEntities.Condition;
				// src = 'condition';
				isGroup = true;
				break;
			case NodeEnum.ExtractData:
				title = FCNode.strExtractData; //lang.FCEntities.ExtractData;
				// src = 'data';
				break;
			case NodeEnum.Complete:
				title = FCNode.strComplete; //lang.FCEntities.Complete;
				// src = 'subend';
				break;
			case NodeEnum.EnterText:
				title = FCNode.strEnterText; //lang.FCEntities.EnterText;
				// src = 'input';
				break;
			case NodeEnum.Loop:
				title = FCNode.strLoop; //lang.FCEntities.Loop;
				// src = 'loop';
				isGroup = true;
				break;
			case NodeEnum.BreakActivity:
				title = FCNode.strBreakActivity; //lang.FCEntities.BreakActivity;
				// src = 'loopbreak';
				break;
			case NodeEnum.Click:
				title = FCNode.strClick; //lang.FCEntities.Click;
				// src = 'mouseclick';
				break;
			case NodeEnum.MouseOver:
				title = FCNode.strMouseOver; //lang.FCEntities.MouseOver;
				// src = 'mousehover';
				break;
			case NodeEnum.Navigate:
				title = FCNode.strNavigate; //lang.FCEntities.Navigate;
				// src = 'openweb';
				break;
			case NodeEnum.SwitchCombo:
				title = FCNode.strSwitchCombo; // lang.FCEntities.SwitchCombo;
				// src = 'switch';
				break;
			case NodeEnum.EnterCapacha:
				title = FCNode.strEnterCapacha; //lang.FCEntities.EnterCapacha;
				// src = 'verify';
				break;
			case NodeEnum.Branch:
				title = FCNode.strBranch; //lang.FCEntities.Branch;
				isGroup = true;
				break;
			case NodeEnum.WFGuideNode:
				title = FCNode.strWFGuideNode; //lang.FCEntities.WFGuideNode;
				break;
			default:
				break;
		}

		node.label = title;
		// node.src = src;
		node.isGroup = isGroup;
		if (!group) {
			group = 'root';
		}
		node.group = group;
		node.category = node.diagramType = FCNode.getDiagramEnum(fcType);

		// 特殊点处理
		switch (node.type) {
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
			// case NodeEnum.Complete:
			case NodeEnum.EnterText:
			// case NodeEnum.BreakActivity:
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

export default FCNode;
