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
		if (!from || from === to) return { key: '', from: '', to: '', category: '' };
		if (!group) group = 'root';
		let link: LineModel = {
			key: `${from}-${to}`,
			from: from,
			to: to,
			category: DiagramEnum.WFLink
		};
		return link;
	}
}

export default LineStore;
