import { DiagramEnum } from '../enum';
import { LinkModel } from '../interface';

/**
 * 得到节点展示的类型
 * @param fcType
 */
export class FCLink {
	/**
	 * 得到线
	 * @param from
	 * @param to
	 * @param group
	 * @param isCondition
	 */
	static getLink(from: string, to: string, group: string, isCondition: boolean = false): LinkModel {
		if (!from || from === to) return { from: '', to: '', group: '' };
		if (!group) group = 'root';
		let link: LinkModel = {
			from: from,
			to: to,
			group: group
		};
		link.key = link.from + link.to;
		link.diagramType = isCondition ? DiagramEnum.WFGuideLink : DiagramEnum.WFLink;
		link.category = link.diagramType;

		return link;
	}
}

export default FCLink;
