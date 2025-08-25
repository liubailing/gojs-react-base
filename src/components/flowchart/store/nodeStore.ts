import { t } from 'i18next';
import { DiagramSetting } from '../config';
import { DiagramEnum, NodeEnum } from '../enum';
import { INodeModel } from '../interface';

/**
 * 得到节点展示的类型
 * @param fcType
 */
export class NodeStore {
	static get strWFGuideLine() {
		return t('main:FCEntities.WFGuideLine');
	}
	static get strCondition() {
		return t('main:FCEntities.Condition');
	}
	static get strExtractData() {
		return t('main:FCEntities.ExtractData');
	}
	static get strComplete() {
		return t('main:FCEntities.Complete');
	}
	static get strEnterText() {
		return t('main:FCEntities.EnterText');
	}
	static get strLoop() {
		return t('main:FCEntities.Loop');
	}

	static get strLoopScrollWeb() {
		return t('main:FCEntities.LoopScrollWeb');
	}
	static get strBreakActivity() {
		return t('main:FCEntities.BreakActivity');
	}
	static get strClick() {
		return t('main:FCEntities.Click');
	}
	static get strMouseOver() {
		return t('main:FCEntities.MouseOver');
	}
	static get strNavigate() {
		return t('main:FCEntities.Navigate');
	}
	static get strSwitchCombo() {
		return t('main:FCEntities.SwitchCombo');
	}
	static get strEnterCapacha() {
		return t('main:FCEntities.EnterCapacha');
	}
	static get strBranch() {
		return t('main:FCEntities.Branch');
	}
	static get strWFGuideNode() {
		return t('main:FCEntities.WFGuideNode');
	}
	static get strWFGuideBranch() {
		return t('main:FCEntities.WFGuideBranch');
	}
	static get strBackPreWebPage() {
		return t('main:FCEntities.BackPreWebPage');
	}

	static getRandomKey = (): string => Math.random().toString(36).substring(2);

	static get baseModel(): INodeModel {
		const n: INodeModel = {
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

	// eslint-disable-next-line complexity
	static getNode = (fcType: string, group: string = '', options?: { isLoopScrollWeb: boolean }): INodeModel => {
		const node: INodeModel = NodeStore.baseModel;
		let title = '';
		let isGroup = false;
		switch (fcType as string) {
			case NodeEnum.Condition:
				title = NodeStore.strCondition;
				// src = 'condition';
				isGroup = true;
				break;
			case NodeEnum.ExtractData:
				title = NodeStore.strExtractData;
				// src = 'data';
				break;
			case NodeEnum.Complete:
				title = NodeStore.strComplete;
				// src = 'subend';
				break;
			case NodeEnum.EnterText:
				title = NodeStore.strEnterText;
				// src = 'input';
				break;
			case NodeEnum.Loop:
				title = options?.isLoopScrollWeb ? NodeStore.strLoopScrollWeb : NodeStore.strLoop;
				// src = 'loop';
				isGroup = true;
				break;
			case NodeEnum.BreakActivity:
				title = NodeStore.strBreakActivity;
				// src = 'loopbreak';
				break;
			case NodeEnum.Click:
				title = NodeStore.strClick;
				// src = 'mouseclick';
				break;
			case NodeEnum.MouseOver:
				title = NodeStore.strMouseOver;
				// src = 'mousehover';
				break;
			case NodeEnum.Navigate:
				title = NodeStore.strNavigate;
				// src = 'openweb';
				break;
			case NodeEnum.SwitchCombo:
				title = NodeStore.strSwitchCombo;
				// src = 'switch';
				break;
			case NodeEnum.EnterCapacha:
				title = NodeStore.strEnterCapacha;
				// src = 'verify';
				break;
			case NodeEnum.Branch:
				title = NodeStore.strBranch;
				isGroup = true;
				break;
			case NodeEnum.WFGuideNode:
				title = NodeStore.strWFGuideNode;
				break;
			case NodeEnum.BackPreWebPage:
				title = NodeStore.strBackPreWebPage;
				break;
			default:
				break;
		}

		node.label = title;
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
			case NodeEnum.BackPreWebPage:
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
