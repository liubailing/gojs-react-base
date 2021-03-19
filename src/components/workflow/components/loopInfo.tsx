/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable accessor-pairs */
import { observer } from 'mobx-react';
import React, { Component } from 'react';
// import lang from '../../../locales';
// import { HandleEnum } from '../../flowchart/enum';
import { WorkflowHandle } from '../workflowHandle';
import { INodeModel } from '../../flowchart/interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FlowChartLoopInfoProps {
	store: WorkflowHandle;
}

@observer
export class FlowChartLoopInfo extends Component<FlowChartLoopInfoProps> {
	loopInfoData: any;
	loopValue: Map<string, string> = new Map();
	constructor(props: FlowChartLoopInfoProps) {
		super(props);
	}

	handleSelectListItem = (value: any, option: any, currNode: any) => {
		this.loopValue.set(currNode.key, value);
		const nodekey = this.props.store.currentActionNodeKey;
		const nodeInfoData = this.props.store.flowchart.onGetNodeData(nodekey);
		this.props.store.handlerShowLoopInfo(nodeInfoData, value, option);
	};

	getLoopValue(): string {
		let value = '';
		const nodekey = this.props.store.currentActionNodeKey;
		const currNode: INodeModel | undefined = this.props.store.flowchart.onGetNode(nodekey);
		if (currNode && currNode.key && this.loopInfoData && this.loopInfoData.data) {
			// const loopValue = this.loopInfoData.data[this.loopValue.get(currNode.key)];
			// if (typeof loopValue === 'string') {
			// 	value = loopValue;
			// }
		}
		return value;
	}

	render() {
		// const nodekey = thsis.props.store.currentActionNodeKey;
		// const currNode: FCNodeModel | undefined = this.injected.customTaskStore..(this.props.store.);

		return (
			<div className="flow-chart-helper">
				<div
					className={`loop-info loop-info${this.props.store.taskId}`}
					id={`loop-info${this.props.store.taskId}`}
					// onClick={() => this.props.store.handlerShowLoopInfo()}
				>
					{/* {this.loopInfoData && (
						<select
							style={{ width: 260 }}
							open={true}
							defaultActiveFirstOption={false}
							// getPopupContainer={() => document.getElementById(`${this.props.store.getLoopInfo}`)}
							// onChange={(value, option) => this.handleSelectListItem(value, option, currNode)}
							// value={this.props.store.getLoopValue()}
						>
							{this.loopInfoData.data.slice(0, 100).map((item, index) => (
								<option value={index} key={`${index}`} title={item}>
									{item}
								</option>
							))}
						</select>
					)} */}
				</div>
			</div>
		);
	}
}
