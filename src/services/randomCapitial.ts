import randomElement from "./randomElement";

/**
 * 從一個陣列中隨機挑選一個元素
 * @param array 給定的陣列
 * @returns 隨機元素
 */
export default function randomCapital(str: string): string {
	let _str: string = "";
	for (let char of str.split("")) {
		_str += randomElement([char.toLowerCase(), char.toUpperCase()]);
	}
	return _str;
}
