import { DiagramEnum } from '../enum';

/**
 * 连线对应的属性
 */
export interface LinkModel {
	from: string; // 连线起始点
	to: string; // 连线结束点
	group: string; // 所在分组
	key?:string,
	//以下属性不用管
	diagramType?: DiagramEnum; // 图形分类      对应 DiagramEnum 里面的    WFLink | WFGuideLink
	category?: string;
	//opacity?: 0 | 1;
}
