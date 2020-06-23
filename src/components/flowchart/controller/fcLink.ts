import { DiagramEnum } from '../enum';
import { LineModel } from '../interface';

/**
 * 得到节点展示的类型
 * @param fcType
 */
export class LineStore {
	/**
	 * 得到线
	 * @param from
	 * @param to
	 * @param group
	 * @param isCondition
	 */
	static getLink(from: string, to: string, group: string): LineModel {
		if (!from || from === to) return { key: '', from: '', to: '', group: '' };
		if (!group) group = 'root';
		let link: LineModel = {
			key: '',
			from: from,
			to: to,
			group: group
		};
		link.key = link.from + link.to;
		// link.diagramType = isCondition ? DiagramEnum.WFGuideLink : DiagramEnum.WFLink;
		link.category = DiagramEnum.WFLink;

		return link;
	}
}

export default LineStore;
