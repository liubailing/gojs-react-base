import { LinkModel } from './linkModel';
import { NodeModel } from './nodeModel';
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
	toLink?: LinkModel;
	toNode?: NodeModel;
	// newNodeToLink?: false;
	newLinks?: LinkModel[];
	// modelChanged?: DiagramModel<NodeModel, LinkModel>
}
