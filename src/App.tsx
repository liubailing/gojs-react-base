/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';

// import Base from './components/base/index';
import Workflow from './components/workflow/workflow';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

class App extends React.Component<{}> {
	public render() {
		return (
			<>
				<div style={{ width: '49%', float: 'left' }}>
					<Workflow key="zxc" taskId="asd"></Workflow>
				</div>

				<div style={{ width: '49%', float: 'left' }}>
					<Workflow key="vbn" taskId="qwe"></Workflow>
				</div>
			</>
		);
	}
}

export default App;
