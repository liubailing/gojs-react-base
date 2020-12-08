/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable accessor-pairs */
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import lang from '../../../locales';
import { HandleEnum } from '../../flowchart/enum';
import { WorkflowHandle } from '../workflowHandle';
// import { NodeModel } from '@src/renderer/components/flowchart/interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FlowChartNodeMenuProps {
	store: WorkflowHandle;
}

@observer
export class FlowChartNodeMenu extends Component<FlowChartNodeMenuProps> {
	constructor(props: FlowChartNodeMenuProps) {
		super(props);
	}

	_currCopyKey = '';
	_currCutKey = '';

	onDoNode(action: HandleEnum) {
		const nodekey = this.props.store.currentActionNodeKey;
		switch (action) {
			case HandleEnum.CopyNode:
				this._currCopyKey = nodekey;
				this._currCutKey = '';
				this.props.store.flowchart.onCopyNode(nodekey);
				break;
			case HandleEnum.DeleteNode:
				this.props.store.flowchart.onRemoveNode(nodekey);

				break;
			case HandleEnum.PasteNode:
				if (this.props.store.flowchart.canCopy) {
					this.props.store.flowchart.onPaste2Node(nodekey);
				}
				if (this.props.store.flowchart.canCut) {
					this.props.store.flowchart.onPaste2Node(nodekey);
					this._currCutKey = '';
				}
				break;
			case HandleEnum.CutNode:
				this._currCopyKey = '';
				this._currCutKey = nodekey;
				this.props.store.flowchart.onCutNode(nodekey);
				break;
		}
		this.props.store.handlerHideContextMenu();
	}
	render() {
		return (
			<div className="flow-chart-helper">
				<div
					className={`more-menu more-menu${this.props.store.taskId}`}
					onContextMenu={(e) => e.preventDefault()}
					// onClick={() => this.injected.customFlowChartStore.handlerShowNodeMenu()}
				>
					<ul>
						<li onClick={() => this.onDoNode(HandleEnum.CopyNode)}>{lang.Flowchart.Copy}</li>
						<li onClick={() => this.onDoNode(HandleEnum.PasteNode)}>{lang.Flowchart.Paste}</li>
						<li onClick={() => this.onDoNode(HandleEnum.DeleteNode)}>{lang.Flowchart.Delete}</li>
						<li onClick={() => this.onDoNode(HandleEnum.CutNode)}>{lang.Flowchart.Cut}</li>
					</ul>
				</div>
			</div>
		);
	}
}