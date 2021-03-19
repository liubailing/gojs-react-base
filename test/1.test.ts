const dy: any = (function () {
	const eventList: Map<string, Function[]> = new Map();
	const publish = function (key: string, fn: Function) {
		if (eventList.has(key)) {
			const fns = eventList.get(key);
			if (fns) {
				fns.push(fn);
			}
			// eventList.get(key)?.push(fn);
		} else {
			eventList.set(key, [fn]);
		}
	};
	const tirgger = function (key: string) {
		if (eventList.has(key)) {
			const fns = eventList.get(key);
			if (fns) {
				const thisArg: any[] = Array.from(arguments);
				thisArg.shift();
				fns.forEach((fn: Function) => {
					fn(thisArg);
				});
			}
		}
	};
	const remove = function (key: string) {
		eventList.delete(key);
	};
	return {
		publish,
		tirgger,
		remove
	};
})();

const key = 'vClick';
dy.publish(key, () => {
	console.log(`----- 1`);
});

dy.publish(key, (args: any) => {
	console.log(`----- 1111 `, args);
});

dy.tirgger(key, 'sss');

export {};
