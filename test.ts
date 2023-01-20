/**
 * 一些replacer
 */
const replacers: { [key: string]: (str: string) => string } = Object.freeze({
	bot: function (str) {
		console.log(str);
		const [_bot, sub, ..._args] = str.split(".");
		switch (sub) {
			case "name": {
				return "a";
			}
		}
		return str;
	}
});

/**
 * 生成一個新的placeholder Replacer
 * @param source 指令執行的context
 * @return 一個Replacer，可以傳入string 翻譯爲翻譯的str
 */
export default function placeholder() {
	return function $(str: string) {
		for (let [key, value] of Object.entries(replacers)) {
			str = str.replace(new RegExp(`%${key}\.(.{1,})%`, "g"), (_origin, arg1, _n, _match) => value(arg1));
		}
		return str;
	};
}
console.log(placeholder()("%bot.a% a w"));

export type Replacer = (str: string) => string;
