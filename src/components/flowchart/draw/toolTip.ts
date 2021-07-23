import go from '@octopus/gojs';
import { BaseColors } from '../config';
const $ = go.GraphObject.make;

export class ToolTip {
	// define tooltips for nodes
	static getTitle(strText: string) {
		return {
			name: 'tooltip_Title',
			toolTip: $(
				'ToolTip',
				{ 'Border.fill': BaseColors.tip, 'Border.stroke': BaseColors.tip, visible: true },
				$(go.TextBlock, {
					wrap: go.TextBlock.WrapFit,
					stroke: BaseColors.tipfont_color,
					margin: 5,
					text: strText
				})
			)
		};
	}
}
