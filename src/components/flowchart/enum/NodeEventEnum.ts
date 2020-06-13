/**
 * Node 相关操作类型
 */
export enum NodeEventEnum {
	// Add = 'Add_new',
	// Selected = 'Select_node',
	//Delete = 'Delete_node',
	// Rename = 'Reset_name',
	// Drag2Node = 'Drag_to_node',
	// Drag2Group = 'Drag_to_group',
	//Drag2Link = 'Drag_to_link',

	DragNode2Link = 'dragNode_to_link',
	DragFCNode2Node = 'dragFCNode_to_node',
	DragFCNode2Link = 'dragFCNode_to_link',

	AddNodeToBefore = 'addNode_to_before',
	AddNodeToAfter = 'addNode_to_after'
	// Move2Node = 'Move_to_node',
	// Move2Group = 'Move_to_group',
	// Move2Link = 'Move_to_link',
	// LinkHightLight = 'Link_HightLight',
	// LinkNomal = 'Link_Normal',
	// AddPrvNode = 'Add_Prv_Node',
	// AddNextNode = 'Add_Next_Node',
	// HightLightLink = 'HightLight_Link',
	// HightLightNode = 'HightLight_Node',
	// HightLightGroup = 'HightLight_group',
	// HightLightCondition = 'HightLight_Condition'
}