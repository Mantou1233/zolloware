import { UserProfile } from "../../classes/Profile";
import { Command } from "../../classes/Command";
import { Source } from "../../classes/Source";
import { CommandType } from "../../typings/enums";
import { EmbedBuilder } from "discord.js";

export default class Sign extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Information,
			parent: "economy",
			name: "profile",
			description: "查看自己"
		});
	}

	public async execute(source: Source): Promise<void> {
		await source.defer();
		const p = await UserProfile(source);
		await source.update({
			embeds: [new EmbedBuilder().applySettings(source.member, "玩家信息").setDescription(`${p.coin} ?`)]
		});

		await p.save();
	}
}
