/**
 * 移除字串中所有 Markdown 語法
 * @param string 給定字串
 * @param replaceTo
 * @return 新字串
 */
export default function removeMd(string: string, replaceTo?: string): string;
export default function removeMd(string: undefined | null, replaceTo?: string): null;
export default function removeMd(string: string | undefined | null, replaceTo: string = "\\"): string | null {
	return string?.replace(/[<@!&#>*_~`\\\|\[\]]/g, input => `${replaceTo}${input}`) ?? null;
}
