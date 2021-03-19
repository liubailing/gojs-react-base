/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import Flowchart from '../flowchart/flowchartDiagram';
import workflowHandle from './workflowHandle';
import './base.css';
import FlowChartMenu from './components';
import TestMenu from './menu';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export interface WorkflowProps {
	taskId: string;
}

@observer
class WorkflowTest extends React.Component<WorkflowProps> {
	Workflow: workflowHandle;
	constructor(props: WorkflowProps) {
		super(props);
		this.Workflow = new workflowHandle(this.props.taskId);
	}

	componentDidMount() {
		this.Workflow.test('render');
	}

	render() {
		return (
			<>
				<div className="div-flowchart-main" id={`div-Main${this.props.taskId}`}>
					<TestMenu Workflow={this.Workflow}></TestMenu>
					<div className="div-flowchart">
						<FlowChartMenu store={this.Workflow} />

						<Flowchart taskId={this.props.taskId} flowchart={this.Workflow.flowchart}></Flowchart>
						<div style={{ height: 300 }}></div>
					</div>
					<div className="div-logs">
						<ul>
							{this.Workflow.logs.reverse().map((x, i) => {
								return (
									<li className={'div-log-item'} key={x + i}>
										{x}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</>
		);
	}
}

export default WorkflowTest;
