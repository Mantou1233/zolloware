import constant from "@root/constant.json";
import config from "@root/config";

/**
 * 一個replacer，
 * obj的key是你要match的main指令, e.g. `asdf` matchs `%asdf.asdfasdf%`.
 */
const replacers: { [key: string]: (str: string, origin: string) => string } = Object.freeze({
	bot: function (str, origin) {
		const [sub, ..._args] = str.split(".");
		switch (sub) {
			case "name": {
				return constant.bot.name;
			}

			case "prefix": {
				return config.bot.prefix;
			}
		}
		return origin;
	}
});

/**
 * 生成一個新的placeholder Replacer
 * @param source 指令執行的context
 * @return 一個Replacer，可以傳入string 翻譯爲翻譯的str
 */
export default function $(str: string, options: { [key: string]: string | number } = {}): string {
	for (let [key, value] of Object.entries(replacers))
		str = str.replace(new RegExp(`%${key}\.(.+?)%`, "g"), (origin, arg1, _n, _match) => value(arg1, origin) || origin);
	for (let [key, value] of Object.entries(options)) str = str.replace(new RegExp(`%${key}%`, "g"), `${value}`);
	return str;
}
