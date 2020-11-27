import go, { Margin } from 'gojs';
import { DiagramSetting, BaseColors } from '../config';
import { DiagramEnum } from '../enum';

const $ = go.GraphObject.make;

export class DrawTitle {
	/**
	 * 节点标题 辅助方法
	 * @param DiagramEnum 节点类型
	 */
	getTitle = (diagramEnum: DiagramEnum): go.Panel => {
		let obj = {};
		switch (diagramEnum) {
			case DiagramEnum.FCNode:
				obj = {
					name: 'node_Title',
					margin: new Margin(1, 0, 0, 0),
					stroke: BaseColors.font
				};
				break;
			case DiagramEnum.ConditionGroup:
			case DiagramEnum.ConditionSwitch:
			case DiagramEnum.LoopGroup:
				obj = {
					name: 'group_Title',
					margin: new Margin(0, 5, 0, 5),
					stroke: BaseColors.group_font
				};
				break;
			default:
				break;
		}

		return $(
			go.Panel,
			'Horizontal',
			{},
			$(
				go.TextBlock,
				{
					...obj,
					...{
						editable: DiagramSetting.renameable,
						mouseEnter: this.onMouseEnter,
						mouseLeave: this.onMouseLeave,
						font: DiagramSetting.font,
						textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {
							// todo 1
							// this.props.store.iFlowchart.onSaveNodeNameHandler(newString);
						}
					}
				},
				// new go.Binding('text', 'isSel', function (s, y) {
				// 	console.log(`>>>>>>>>  33333333333`);
				// 	if (s || y) return BaseColors.highlight;
				// 	return BaseColors.backgroud;
				// 	return s ? BaseColors.highlight : BaseColors.backgroud;
				// }).ofObject()
				new go.Binding('text', this.showLabel, this.covShowLabel)
			)
		);
	};

	/**
	 * 返回字段
	 */
	private get showLabel(): string {
		// return 'sortIndex';
		if (DiagramSetting.showKey) {
			return 'key';
		}
		if (DiagramSetting.showLabel) {
			return DiagramSetting.showLabel;
		}
		return 'label';
	}

	/**
	 * 返回名字
	 */
	private covShowLabel = (_val: any, _targetObj: any): string => {
		if (_val && typeof _val === 'string') {
			const { len } = this.gbLenght(_val);
			if (len > 20) {
				return `${_val.slice(0, 9)}···`;
			}
		}
		return _val;
	};

	/**
	 * 计算名称显示长度， 字母算1个长度，文字算2个长度
	 */
	private gbLenght = function (str: string) {
		let len = 0;
		for (let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
				len += 2;
			} else {
				len++;
			}
		}
		return { len };
	};

	/**
	 * 鼠标移入显示全名val
	 */
	private onMouseEnter = (_val: any, _obj: any): void => {
		// const node = (_obj as any).part;
	};

	/**
	 * 鼠标移出隐藏
	 */
	private onMouseLeave = (_val: any, _obj: any): void => {
		// const node = (_obj as any).part;
	};
}

const drawTitle = new DrawTitle();

export default drawTitle;
