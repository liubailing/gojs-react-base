import go, { Diagram } from 'gojs';
import { BaseColors } from '../config';

const $ = go.GraphObject.make;

export default class DrawAdornment {
	static setAdornment(diagram: Diagram): Diagram {
		/** 修改线 */
		diagram.linkSelectionAdornmentTemplate = $(
			go.Adornment,
			'Auto',
			$(go.Shape, {
				fill: null,
				stroke: null,
				strokeWidth: 1,
				strokeDashArray: [1, 1]
			}),
			$(go.Placeholder)
		);

		/** 修改组 */
		diagram.groupSelectionAdornmentTemplate = $(
			go.Adornment,
			'Auto',
			$(go.Shape, {
				fill: null,
				stroke: null,
				strokeWidth: 1,
				// strokeDashArray: [2, 2],
				opacity: 0
			}),
			$(go.Placeholder)
		);

		/** 修改点 */
		diagram.nodeSelectionAdornmentTemplate = $(
			go.Adornment,
			'RoundedRectangle',
			$(go.Shape, {
				fill: null,
				stroke: null,
				strokeWidth: 0,
				// strokeDashArray: [2, 2],
				opacity: 0
			}),
			$(go.Placeholder)
		);

		return diagram;
	}
}
