/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';

// import Base from './components/base/index';
import Flowchart from '../flowchartDiagram';
import Workflow, { WorkflowHandle } from './workflowHandle';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

class App extends React.Component<{}> {
	public render() {
		return (
			<>
				<Flowchart flowchart={Workflow.flowchart}></Flowchart>
				<div>
					<button onClick={() => Workflow.flowchart.initFlochart(false)}>重新渲染</button>
					<button onClick={() => Workflow.flowchart.initFlochart()}>设置选中</button>
					<button onClick={() => Workflow.flowchart.initFlochart()}>新增</button>
				</div>
			</>
		);
	}
}

export default App;
