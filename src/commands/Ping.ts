import { Command } from "../classes/Command";
import { Source } from "../classes/Source";
import { CommandType } from "../typings/enums";
import $ from "../services/translatePlaceholder";

export default class Ping extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Miscellaneous,
			name: "ping",
			description: "敲一下我的大腿看我的反應時間"
		});
	}

	public async execute(source: Source): Promise<void> {
		await source.defer();
		const message = await source.update("計算中……");
		const ping = message.createdTimestamp - source.createdTimestamp;
		await message.edit(
			$(`:information_source:｜Pong！機器人延遲為：%ping%ms，API 延遲為：%ws_ping%ms`, {
				ping,
				ws_ping: source.client.ws.ping
			})
		);
	}
}
