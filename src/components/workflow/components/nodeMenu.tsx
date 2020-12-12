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

	onDoNode(action: HandleEnum) {
		const nodekey = this.props.store.currentActionNodeKey;
		switch (action) {
			case HandleEnum.CopyNode:
				this.props.store.flowchart.onCopyNode(nodekey, true);
				break;
			case HandleEnum.DeleteNode:
				this.props.store.flowchart.onRemoveNode(nodekey);

				break;
			case HandleEnum.PasteNode:
				if (this.props.store.flowchart.canCopy) {
					this.props.store.flowchart.onPaste2Node(nodekey);
				}
				if (this.props.store.flowchart.canCut) {
					this.props.store.flowchart.onCutNode2PasteNode(nodekey);
				}
				break;
			case HandleEnum.CutNode:
				this.props.store.flowchart.onCutNode(nodekey, true);
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
