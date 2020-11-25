import Linked from './linked';

test('getToken', async () => {
	const list1 = new Linked<number>();
	// list1.add(3);
	// list1.add(5);
	// list1.insert(3, 4);
	// list1.insert(4, 8);
	// list1.print();
	// /*输出：
	// Item {_name: "3", _value: 3, _prev: Item, _next: Item}
	// Item {_name: "4", _value: 4, _prev: Item, _next: Item}
	// Item {_name: "8", _value: 8, _prev: Item, _next: Item}
	// Item {_name: "5", _value: 5, _prev: Item, _next: Item}
	// */
	// list1.remove(4);
	// list1.print();
	/* 输出：
	Item {_name: "3", _value: 3, _prev: Item, _next: Item}
	Item {_name: "8", _value: 8, _prev: Item, _next: Item}
	Item {_name: "5", _value: 5, _prev: Item, _next: Item}
	*/
	// console.log(list1.find(4)); //null
	// // console.log(list1.reverse_find(3)); //3
	// list1.clear();

	const list2 = new Linked<string>();
	list2.add('3');
	list2.add('5');
	list2.insert('3', '4');
	list2.insert('4', '8');
	// list2.print();
	/* 输出：
	Item {_name: "3", _value: "3", _prev: Item, _next: Item}
	Item {_name: "4", _value: "4", _prev: Item, _next: Item}
	Item {_name: "8", _value: "8", _prev: Item, _next: Item}
	Item {_name: "5", _value: "5", _prev: Item, _next: Item}
	*/
	list2.remove('4');
	// list2.print();
	/* 输出：
	Item {_name: "3", _value: "3", _prev: Item, _next: Item}
	Item {_name: "8", _value: "8", _prev: Item, _next: Item}
	Item {_name: "5", _value: "5", _prev: Item, _next: Item}
	*/
	list2.clear();

	// 用自定义类型来测试下
	class Demo {
		constructor(public name: string, public value: number) {
			this.name = name;
			this.value = value;
		}
		toString(): string {
			return `{name: ${this.name} value: ${this.value}}`;
		}
	}
	const list3 = new Linked<Demo>();
	const demos = [new Demo('3', 3), new Demo('5', 5), new Demo('4', 4), new Demo('8', 8)];
	list3.add(demos[0]);
	list3.add(demos[1]);
	list3.insert(demos[0], demos[2]);
	list3.insert(demos[2], demos[3]);
	// list3.print();
	/* 输出：
	Item {_name: "{name: 3 value: 3}", _value: Demo, _prev: Item, _next: Item}
	Item {_name: "{name: 4 value: 4}", _value: Demo, _prev: Item, _next: Item}
	Item {_name: "{name: 8 value: 8}", _value: Demo, _prev: Item, _next: Item}
	Item {_name: "{name: 5 value: 5}", _value: Demo, _prev: Item, _next: Item}
	*/
	list3.remove(demos[2]);
	// list3.print();
	/* 输出：
	Item {_name: "{name: 3 value: 3}", _value: Demo, _prev: Item, _next: Item}
	Item {_name: "{name: 8 value: 8}", _value: Demo, _prev: Item, _next: Item}
	Item {_name: "{name: 5 value: 5}", _value: Demo, _prev: Item, _next: Item}
	*/
	list3.clear();
});
