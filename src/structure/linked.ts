interface IList<T> {
	add(a: T): void; //添加元素
	insert(item: T, a: T): void; //插入元素
	remove(a: T): void; //移除元素
	header(): T; //返回头元素
	tail(): T; //返回尾元素
	find(a: T): T; //查找元素
	size(): number; //返回列表元素个数
	empty(): boolean; //是否空列表
	clear(): void; //清空列表
}

class Item<T> {
	private _name: string;
	private _value: T; //值
	// private _prev: Item<T> | null; //指向的上一个元素
	private _next: Item<T> | null; //指向的下一个元素
	constructor(value?: T) {
		this._name = value + '';
		this._value = value as any;
		this._next = null;
	}
	set name(name: string) {
		this._name = name;
	}
	get name(): string {
		return this._name;
	}
	set value(value: T) {
		this._value = value;
	}
	get value(): T {
		return this._value;
	}
	set next(item: Item<T>) {
		this._next = item;
	}
	get next(): Item<T> {
		return this._next as any;
	}
}

class Linked<T> implements IList<T> {
	private _count: number = 0; //记录元素个数
	private _header: Item<T>; //头元素
	private _tail: Item<T>; //尾元素
	constructor() {
		this._header = new Item<T>();
		this._header.name = 'header';
		this._tail = new Item<T>();
		this._tail.name = 'tail';
		this._header.next = this._tail;
		this._tail.next = this._header;
	}
	add(a: T) {
		let item = new Item<T>(a);
		this._header.next = item;
		item.next = this._tail;
		this._count++;
	}

	insert(item: T, a: T) {
		if (this.empty()) {
			return;
		}
		let indexItem = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.value == item) {
				let valueItem = new Item<T>(a);
				valueItem.next = indexItem.next;
				indexItem.next = valueItem;
				this._count++;
				break;
			}
			indexItem = indexItem.next;
		}
	}

	remove(a: T): T {
		if (this.empty()) {
			return null as any;
		}
		let indexItem = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.value == a) {
				indexItem.next = null as any;
				let value = indexItem.value;
				indexItem.value = null as any;
				indexItem = null as any;
				this._count--;
				return value;
			}
			indexItem = indexItem.next;
		}
		return null as any;
	}

	header(): T {
		return this._header.next.value;
	}

	tail(): T {
		return this._tail.value;
	}

	find(a: T): T {
		if (this.empty()) {
			return null as any;
		}
		let indexItem = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.value == a) {
				return indexItem.value;
			}
			indexItem = indexItem.next;
		}
		return null as any;
	}

	size(): number {
		return this._count;
	}

	empty(): boolean {
		return this._count === 0;
	}

	clear(): void {
		let item = this._header.next;
		while (item !== this._tail) {
			item.value = null as any;
			item = item.next;
		}
		this._header.next = this._tail;
		this._count = 0;
	}

	print() {
		let item = this._header.next;
		while (item !== this._tail) {
			console.log(item);
			item = item.next;
		}
	}
}

export default Linked;
