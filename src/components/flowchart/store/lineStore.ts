import { ILineModel } from '../interface';

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
	static getLink(from: string, to: string, group: string): ILineModel {
		if (!from || from === to) {
			return { key: '', from: '', to: '' };
		}
		if (!group) {
			group = 'root';
		}
		const link: ILineModel = {
			key: `${from}${to}`,
			from,
			to
		};
		return link;
	}
}

export default LineStore;
