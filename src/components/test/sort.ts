export class Sort {
	static quick(arr: Array<number>): Array<number> {
		// 边界1
		if (arr.length <= 1) return arr;

		// 取中位数
		const mid = Math.floor(arr.length / 2);

		// 取中间值
		const midV = arr.splice(mid, 1)[0];
		const lArr = arr.filter((x) => x < midV);
		const rArr = arr.filter((x) => x >= midV);

		return this.quick(lArr).concat([midV], this.quick(rArr));
	}

	static bubble(arr: Array<number>): Array<number> {
		var len = arr.length;
		for (var i = 0; i < len - 1; i++) {
			for (var j = 0; j < len - 1 - i; j++) {
				if (arr[j] > arr[j + 1]) {
					// 相邻元素两两对比
					var temp = arr[j + 1]; // 元素交换
					arr[j + 1] = arr[j];
					arr[j] = temp;
				}
			}
		}
		return arr;
	}

	static insertion(arr: Array<number>): Array<number> {
		var len = arr.length;
		var preIndex, current;
		for (var i = 1; i < len; i++) {
			preIndex = i - 1;
			current = arr[i];
			while (preIndex >= 0 && arr[preIndex] > current) {
				arr[preIndex + 1] = arr[preIndex];
				preIndex--;
			}
			arr[preIndex + 1] = current;
		}
		return arr;
	}

	static maxProduct(arr: Array<number>): number {
		let max = Number.MIN_VALUE,
			imax = 1,
			imin = 1;

		for (let i = 0; i < arr.length; i++) {
			const current = arr[i];
			if (current < 0) {
				let temp = current;
				imax = imin;
				imin = temp;
			}
			imax = Math.max(imax * current, current);
			imin = Math.min(imin * current, current);

			max = Math.max(imax, max);
		}
		return max;
	}

	static maxProduct1(arr: Array<number>): number {
		let max = Number.MIN_VALUE,
			imax = 1,
			imin = 1,
			isPush = true,
			tempMax = max,
			resMap = new Map<number, Array<any>>();

		for (let i = 0; i < arr.length; i++) {
			const current = arr[i];
			if (current < 0) {
				let temp = current;
				imax = imin;
				imin = temp;
			}
			imax = Math.max(imax * current, current);
			imin = Math.min(imin * current, current);

			if (max > imax === isPush && tempMax > max) {
				let tmp = [];
				if (resMap.has(i - 1)) {
					tmp = resMap.get(i - 1) || [];
				}
				resMap.set(i, [...tmp, ...[current]]);
				tempMax = max;
			} else {
				resMap.set(i, [current]);
			}
			isPush = max > imax;
			max = Math.max(imax, max);
		}
		console.log('>>>>>>>>----- ', resMap);
		return max;
	}
}
