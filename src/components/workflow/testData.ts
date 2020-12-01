import { ActionNodeType } from './entity';

export default {
	key: 'root',
	type: 'root',
	childKeys: [],
	childs: [
		{
			key: 'openJD',
			label: 'openJD123',
			type: ActionNodeType.Navigate as string,
			data: { tip: '这是一个node1存值' }
		},
		// {
		// 	key: 'cond',
		// 	type: ActionNodeType.Condition as string,
		// 	childs: [
		// 		{
		// 			key: 'branch1-1',
		// 			label: 'MMMMMMMMMMMMMMMMMMMMMMMMM',
		// 			type: ActionNodeType.Branch as string,
		// 			childs: [
		// 				{ key: 'data11-1', type: ActionNodeType.ExtractData as string }
		// 				// { key: 'jd-shouji', label: "打开手机专卖", type: ActionNodeType.Navigate as string },
		// 				// { key: 'data11-2', type: ActionNodeType.ExtractData as string },
		// 			]
		// 		},
		// 		{
		// 			key: 'branch1-2',
		// 			type: ActionNodeType.Branch as string,
		// 			childs: [
		// 				{ key: 'jd-chaoshi', label: '打开生鲜超市', type: ActionNodeType.Navigate as string },
		// 				{ key: 'data12-2', type: ActionNodeType.ExtractData as string }
		// 			]
		// 		},
		// 		{
		// 			key: 'branch1-3',
		// 			type: ActionNodeType.Branch as string
		// 		},
		// 		{
		// 			key: 'branch1-4',
		// 			type: ActionNodeType.Branch as string,
		// 			data: { tip: '这是一个branch1存值111111' },
		// 			childs: [
		// 				{
		// 					key: 'data16-2',
		// 					type: ActionNodeType.ExtractData as string,
		// 					data: { tip: '这是一个1212121212' }
		// 				},
		// 				{ key: 'jd-lingquan', label: '打开优惠券', type: ActionNodeType.Navigate as string },
		// 				{ key: 'data122-2', type: ActionNodeType.ExtractData as string }
		// 			]
		// 		}
		// 	]
		// },
		// { key: 'data00-2', type: ActionNodeType.ExtractData as string, parentKey: 'root' },
		// {
		// 	key: 'jd-dingdan',
		// 	label: '打开我的订单',
		// 	type: ActionNodeType.Navigate as string,
		// 	data: { tip: '这是一个loop存值111111' },
		// 	parentKey: 'root'
		// },
		// { key: 'data44-2', type: ActionNodeType.ExtractData as string, parentKey: 'root' },
		// {
		// 	key: 'loop',
		// 	type: ActionNodeType.Loop as string,
		// 	parentKey: 'root',
		// 	data: { tip: '这是一个loop存值' },
		// 	childs: []
		// },
		{
			key: 'loop2',
			label: '循环循环循环循环循环循环循环循环循环循环循环',
			type: ActionNodeType.Loop as string,
			parentKey: 'root',
			childs: [
				{ key: 'data64-3', label: '测试', type: ActionNodeType.ExtractData as string },
				{
					key: 'jd-xunhuna-pages',
					label: '循环翻页循环翻页循环翻页循环翻页循环翻页循环翻页',
					type: ActionNodeType.Navigate as string
				},
				{ key: 'data22-2', type: ActionNodeType.ExtractData as string },
				{ key: 'jd-xunhuan-data', label: '循环提取数据', type: ActionNodeType.Navigate as string },
				{ key: 'data24-3', type: ActionNodeType.ExtractData as string }
			]
		},
		{ key: 'data', type: ActionNodeType.ExtractData as string, parentKey: 'root' }
	]
};
