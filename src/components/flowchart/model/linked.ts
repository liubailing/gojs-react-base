interface IList<T> {
	add(a: T): void; //添加元素
	insert(item: T, a: T): void; //插入元素
	insertPre(item: T, a: T): void; //插入元素
	replace(item: T, a: T): void; //替换元素
	remove(a: T): void; //移除元素
	header(): T; //返回头元素
	find(a: T): T; //查找元素
	findPre(a: T): T; //查找元素
	size(): number; //返回列表元素个数
	empty(): boolean; //是否空列表
	clear(): void; //清空列表
}

class Item<T> {
	private _name: string;
	private _value: T; //值
	private _next: Item<T> | null; //指向的下一个元素
	constructor(value?: T) {
		this._name = value + '';
		this._value = value as T;
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
		return this._value as T;
	}
	set next(item: Item<T>) {
		this._next = item;
	}
	get next(): Item<T> {
		return this._next as any;
	}
}

class DobuleList<T> implements IList<T> {
	_count: number = 0; //记录元素个数
	_header: Item<T>; //头元素
	_tail: Item<T>; //尾元素
	constructor() {
		this._header = new Item<T>();
		this._header.name = 'header';
		this._tail = new Item<T>();
		this._tail.name = 'tail';
		this._header.next = this._tail;
		this._tail.next = null as any;
	}

	add(a: T): boolean {
		let item = new Item<T>(a);
		let indexItem: any = this._header;
		while (indexItem.next !== this._tail) {
			indexItem = indexItem.next;
		}
		indexItem.next = item;
		item.next = this._tail;
		this._count++;
		return true;
	}

	insert(item: T, a: T): boolean {
		if (this.empty()) {
			return false;
		}
		let indexItem = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.value === item) {
				let valueItem = new Item<T>(a);
				valueItem.next = indexItem.next;
				indexItem.next = valueItem;
				this._count++;
				return true;
			}
			indexItem = indexItem.next;
		}

		return false;
	}

	insertPre(item: T, a: T): boolean {
		if (this.empty()) {
			return false;
		}
		let indexItem = this._header.next;
		let preItem = this._header;
		while (indexItem !== this._tail) {
			if (indexItem.value === item) {
				let valueItem = new Item<T>(a);
				valueItem.next = indexItem;
				preItem.next = valueItem;
				this._count++;
				return true;
			}
			preItem = indexItem;
			indexItem = indexItem.next;
		}

		return false;
	}

	replace(item: T, newItem: T): boolean {
		if (this.empty()) {
			return false;
		}
		let indexItem = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.value === item) {
				indexItem.value = newItem;
				return true;
			}
			indexItem = indexItem.next;
		}
		return false;
	}

	remove(a: T): T {
		if (this.empty()) {
			return null as any;
		}
		let indexItem = this._header.next;
		let preItem = this._header;
		while (indexItem !== this._tail) {
			if (indexItem.value === a) {
				// 前指针 重新 指向后指针
				preItem.next = indexItem.next;

				let value = indexItem.value;
				indexItem.value = null as any;
				indexItem = null as any;
				this._count--;
				return value;
			}
			preItem = indexItem;
			indexItem = indexItem.next;
		}
		return null as any;
	}

	header(): T {
		return this._header.next.value;
	}

	tail(): T {
		if (this.empty()) {
			return null as any;
		}

		let indexItem: any = this._header.next;
		while (indexItem !== this._tail) {
			if (indexItem.next === this._tail) {
				return indexItem;
			}
			indexItem = indexItem.next;
		}
		return indexItem;
	}

	tailPre(): T {
		if (this.empty()) {
			return null as any;
		}

		let indexItem: any = this._header.next;
		let preItem = this._header;
		while (indexItem !== this._tail) {
			if (indexItem.next === this._tail) {
				if (preItem === this._header) {
					return null as any;
				}
				return preItem.value;
			}
			preItem = indexItem;
			indexItem = indexItem.next;
		}

		return null as any;
	}

	find(a: T): T {
		if (this.empty()) {
			return null as any;
		}

		let indexItem: any = this._header.next;
		while (indexItem.value !== a) {
			indexItem = indexItem.next;
		}
		return indexItem;
	}

	findPre(a: T): T {
		if (this.empty()) {
			return null as any;
		}

		let indexItem: any = this._header.next;
		let preItem = this._header;
		while (indexItem !== this._tail) {
			if (indexItem.next === a) {
				if (preItem === this._header) {
					return null as any;
				}
				return preItem.value;
			}
			preItem = indexItem;
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

	toArray(): T[] {
		let arr = new Array<T>();
		let indexItem: any = this._header.next;
		while (indexItem !== this._tail) {
			arr.push(indexItem.value);
			indexItem = indexItem.next;
		}
		return arr;
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
}

export default DobuleList;
