import { FCLinkModel } from './FCLinkModel';
import { FCNodeModel } from './FCNodeModel';
import { NodeEventEnum } from '../enum';

/**
 * node 操作事件-相关参数
 */
export interface NodeEvent {
	eType: NodeEventEnum;
	setSelected: boolean;
	actType: 'cmd' | 'userDrag';
	name?: string;
	key?: string;
	toKey?: string;
	toLink?: FCLinkModel;
	toNode?: FCNodeModel;
	// newNodeToLink?: false;
	newLinks?: FCLinkModel[];
	// modelChanged?: DiagramModel<FCNodeModel, FCLinkModel>
}
