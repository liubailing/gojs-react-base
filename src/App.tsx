/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';

// import Base from './components/base/index';
import Flowchart, { FlowChartProps } from './components/flowchart/flowchartDiagram';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

class App extends React.Component<{}> {
	constructor({}) {
		super({});
	}

	flowChartProps: FlowChartProps = { lang: 'en' };

	public render() {
		return (
			<>
				<Flowchart {...this.flowChartProps}></Flowchart>
				{/* <Base> </Base> */}
			</>
		);
	}
}

export default App;
