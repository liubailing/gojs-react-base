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
				<Workflow key="1sdsds" taskId="sdasdawwcc"></Workflow>
				<br />
				<br />
				<Workflow key="3333d" taskId="sss12121444"></Workflow>
			</>
		);
	}
}

export default App;
