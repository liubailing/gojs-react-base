import go, { Margin } from '@octopus/gojs';
import { DiagramSetting, BaseColors,SelectedColors } from '../config';
import { DiagramEnum } from '../enum';

const $ = go.GraphObject.make;

export class DrawTitle {
	// define tooltips for nodes
	tooltiptemplate = $(
		'ToolTip',
		{ 'Border.fill': BaseColors.tip, 'Border.stroke': BaseColors.tip, visible: true },
		$(
			go.TextBlock,
			{
				stroke: BaseColors.tipfont,
				wrap: go.TextBlock.WrapFit,
				margin: new Margin(1,2)
			},
			new go.Binding('text', 'label')
		)
	);

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
					// stroke: BaseColors.font
				};
				break;
			case DiagramEnum.ConditionGroup:
			case DiagramEnum.ConditionSwitch:
			case DiagramEnum.LoopGroup:
				obj = {
					name: 'group_Title',
					margin: new Margin(0, 5, 0, 5)
				};
				break;
			default:
				break;
		}

		return $(
			go.Panel,
			'Horizontal',
			{ toolTip: this.tooltiptemplate },
			$(
				go.TextBlock,
				{
					...obj,
					...{
						editable: DiagramSetting.renameable,
						font: DiagramSetting.font,
						textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {
							// todo 1
							// this.props.store.iFlowchart.onSaveNodeNameHandler(newString);
						}
					}
				},
				new go.Binding('text', this.showLabel, this.covShowLabel),
				new go.Binding('stroke', 'isSelected', this.getNodeStroke).ofObject()
			)
		);
	};

	/**
	 * 返回背景颜色
	 */
	 private getNodeStroke = (_val: any, _targetObj: any): string =>{
	 // const node = (_targetObj as any).part;
	  return _val ? SelectedColors.font : BaseColors.font
	 }

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
			if (len > 16) {
				return `${_val.slice(0, 8)}···`;
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
}

const drawTitle = new DrawTitle();

export default drawTitle;
