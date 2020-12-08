/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable accessor-pairs */
import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import { NodeEnum } from '../../flowchart/enum';
import lang from '../../../locales';
import { WorkflowHandle } from '../workflowHandle';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FlowChartLineMenuProps {
	store: WorkflowHandle;
}

@observer
export class FlowChartLineMenu extends Component<FlowChartLineMenuProps> {
	constructor(props: FlowChartLineMenuProps) {
		super(props);
	}

	addNode(type: NodeEnum) {
		const nodekey = this.props.store.currentActionNodeKey;
		this.props.store.flowchart.onAdd2Pre8NodeId(nodekey, type);
		this.props.store.handlerHideContextMenu();
	}
	render() {
		return (
			<div className="flow-chart-helper">
				<div className={`add-node-menu add-node-menu${this.props.store.taskId}`}>
					<ul>
						<li key={`${NodeEnum.Click}`} onClick={() => this.addNode(NodeEnum.Click)}>
							{lang.FCEntities.Click}
						</li>
						<li key={`${NodeEnum.ExtractData}`} onClick={() => this.addNode(NodeEnum.ExtractData)}>
							{lang.FCEntities.ExtractData}
						</li>
						<li key={`${NodeEnum.Loop}`} onClick={() => this.addNode(NodeEnum.Loop)}>
							{lang.FCEntities.Loop}
						</li>
						<li key={`${NodeEnum.Condition}`} onClick={() => this.addNode(NodeEnum.Condition)}>
							{lang.FCEntities.Condition}
						</li>
						<li key={`${NodeEnum.Navigate}`} onClick={() => this.addNode(NodeEnum.Navigate)}>
							{lang.FCEntities.Navigate}
						</li>
						<li key={`${NodeEnum.EnterText}`} onClick={() => this.addNode(NodeEnum.EnterText)}>
							{lang.FCEntities.EnterText}
						</li>
						<li key={`${NodeEnum.EnterCapacha}`} onClick={() => this.addNode(NodeEnum.EnterCapacha)}>
							{lang.FCEntities.EnterCapacha}
						</li>
						<li key={`${NodeEnum.SwitchCombo}`} onClick={() => this.addNode(NodeEnum.SwitchCombo)}>
							{lang.FCEntities.SwitchCombo}
						</li>
						<li key={`${NodeEnum.MouseOver}`} onClick={() => this.addNode(NodeEnum.MouseOver)}>
							{lang.FCEntities.MouseOver}
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
