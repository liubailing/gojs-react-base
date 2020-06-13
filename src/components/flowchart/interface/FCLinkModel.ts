import {FCDiagramEnum} from '../enum'

/**
 * 连线对应的属性
 */
export interface FCLinkModel  {
	from: string; // 连线起始点
	to: string; // 连线结束点
	group: string; // 所在分组

	//以下属性不用管
	diagramType?: FCDiagramEnum; // 图形分类      对应 FCDiagramEnum 里面的    WFLink | WFGuideLink
	category?: string;
	//opacity?: 0 | 1;
}
