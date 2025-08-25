import go, { Margin } from '@octopus/gojs';
import { DiagramSetting, BaseColors, SelectedColors } from '../config';
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
				margin: new Margin(1, 2)
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
					width: 95,
					textAlign: 'center',
					margin: new Margin(1, 0, 0, 0)
					// stroke: BaseColors.font
				};
				break;
			case DiagramEnum.ConditionGroup:
			case DiagramEnum.ConditionSwitch:
			case DiagramEnum.LoopGroup:
				obj = {
					name: 'group_Title',
					width: 105,
					textAlign: 'left',
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
						overflow: go.TextBlock.OverflowEllipsis,
						maxLines: 1,
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {}
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private getNodeStroke = (_val: any,_targetObj:any): string =>
		// const node = (_targetObj as any).part;
		_val ? SelectedColors.font : BaseColors.font;

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private covShowLabel = (_val: any,_targetObj:any): string => _val;
}

const drawTitle = new DrawTitle();

export default drawTitle;
