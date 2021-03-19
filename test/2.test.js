const list = [1, 2, 3];
const square = (num) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(num * num);
			console.log(num * num);
		}, 1000);
	});

function test() {
	list.forEach(async (x) => {
		await square(x);
	});
}
test();
