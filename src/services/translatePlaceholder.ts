import { Source } from "./../classes/Source";

/**
 * 一些replacer
 */
const replacers: { [key: string]: (source: Source, str: string) => string } = Object.freeze({
	bot: function (source, str) {
		const [_bot, sub, ..._args] = str.split(".");
		switch (sub) {
			case "name": {
				return "froggy";
			}
			case "fullname": {
				return source.client.user?.username || "o";
			}
		}
		return str;
	}
});

/**
 * 生成一個新的placeholder translator
 * @param source 指令執行的context
 * @return 一個translator，可以傳入string 翻譯爲翻譯的str
 */
export default function placeholder(source: Source) {
	return function $(str: string) {
		for (let [key, value] of Object.entries(replacers)) {
			str = str.replace(new RegExp(`/%${key}\.(.{1,})%/g`), (_origin, arg1, _n, _match) => value(source, arg1));
		}
		return str;
	};
}
