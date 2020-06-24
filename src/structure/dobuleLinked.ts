interface IList<T> {
	add(a: T): void; //添加元素
	insert(item: T, a: T): void; //插入元素
	remove(a: T): void; //移除元素
	header(): T; //返回头元素
	tail(): T; //返回尾元素
	find(a: T): T; //查找元素
	reverse_find(a: T): T; //反向查找元素
	size(): number; //返回列表元素个数
	empty(): boolean; //是否空列表
	clear(): void; //清空列表
}

class Item<T> {
	private _name: string;
	private _value: T; //值
	private _prev: Item<T> | null; //指向的上一个元素
	private _next: Item<T> | null; //指向的下一个元素
	constructor(value?: T) {
		this._name = value + '';
		this._value = value as any;
		this._prev = null;
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
	set prev(item: Item<T>) {
		this._prev = item;
	}
	get prev(): Item<T> {
		return this._prev as any;
	}
	set next(item: Item<T>) {
		this._next = item;
	}
	get next(): Item<T> {
		return this._next as any;
	}
}

class DobuleList<T> implements IList<T> {
	private _count: number = 0; //记录元素个数
	private _header: Item<T>; //头元素
	private _tail: Item<T>; //尾元素
	constructor() {
		this._header = new Item<T>();
		this._header.name = 'header';
		this._tail = new Item<T>();
		this._tail.name = 'tail';
		this._header.prev = this._header.next = this._tail;
		this._tail.next = this._tail.prev = this._header;
	}
	add(a: T) {
		let item = new Item<T>(a);
		item.prev = this._tail.prev;
		item.next = this._tail;
		this._tail.prev = item;
		item.prev.next = item;
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
				valueItem.prev = indexItem;
				valueItem.next = indexItem.next;
				indexItem.next.prev = valueItem;
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
				indexItem.prev.next = indexItem.next;
				indexItem.next.prev = indexItem.prev;
				indexItem.next = null as any;
				indexItem.prev = null as any;
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
		return this._tail.prev.value;
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

	reverse_find(a: T): T {
		if (this.empty()) {
			return null as any;
		}
		let indexItem = this._tail.prev;
		while (indexItem !== this._header) {
			if (indexItem.value == a) {
				return indexItem.value;
			}
			indexItem = indexItem.prev;
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
			item.prev = null as any;
			item.value = null as any;
			item = item.next;
			item.prev.next = null as any;
		}
		this._header.next = this._tail;
		this._tail.prev = this._header;
		this._count = 0;
	}

	print() {
		let item = this._header.next;
		while (item !== this._tail) {
			console.log(`${item}`);
			item = item.next;
		}
	}
}

export default DobuleList;
