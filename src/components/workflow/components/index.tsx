/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable accessor-pairs */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { WorkflowHandle } from '../workflowHandle';
import { FlowChartLineMenu } from './lineMeun';
import { FlowChartLoopInfo } from './loopInfo';
import { FlowChartNodeMenu } from './nodeMenu';
import './index.css';
// export { FlowChartLineMenu, FlowChartLoopInfo, FlowChartNodeMenu };

interface FlowChartMenuProps {
	store: WorkflowHandle;
}

@observer
export default class FlowChartMenu extends Component<FlowChartMenuProps> {
	constructor(props: FlowChartMenuProps) {
		super(props);
	}

	render() {
		const { currentNodeMenuShowType, currentNodeMenuPosX, currentNodeMenuPosY } = this.props.store;
		return (
			<div
				style={{
					display: `${currentNodeMenuShowType ? 'block' : 'none'}`,
					position: `absolute`,
					top: currentNodeMenuPosY,
					left: currentNodeMenuPosX
				}}
			>
				{currentNodeMenuShowType === 1 && <FlowChartLineMenu store={this.props.store} />}
				{currentNodeMenuShowType === 3 && <FlowChartLoopInfo store={this.props.store} />}
				{currentNodeMenuShowType === 2 && <FlowChartNodeMenu store={this.props.store} />}
			</div>
		);
	}
}
