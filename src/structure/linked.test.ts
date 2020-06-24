import linked from './linked';

let list1 = new linked<number>();
list1.add(3);
list1.add(5);
list1.insert(3, 4);
list1.insert(4, 8);

let tail = list1.tail();

console.log(`-----`, tail);

list1.print();
/*输出：
Item {_name: "3", _value: 3, _prev: Item, _next: Item}
Item {_name: "4", _value: 4, _prev: Item, _next: Item}
Item {_name: "8", _value: 8, _prev: Item, _next: Item}
Item {_name: "5", _value: 5, _prev: Item, _next: Item}
*/
list1.remove(4);
list1.print();

/*输出：
Item {_name: "3", _value: 3, _prev: Item, _next: Item}
Item {_name: "8", _value: 8, _prev: Item, _next: Item}
Item {_name: "5", _value: 5, _prev: Item, _next: Item}
*/
