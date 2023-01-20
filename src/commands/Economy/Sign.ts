import { toWords } from "./../../services/numberToChinese";
import { UserProfile } from "../../classes/Profile";
import { Command } from "../../classes/Command";
import { Source } from "../../classes/Source";
import { CommandType } from "../../typings/enums";
import { EmbedBuilder } from "discord.js";
import ms from "ms";
import randomInt from "@root/src/services/randomInt";
import randomElement from "@root/src/services/randomElement";

export default class Sign extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Information,
			parent: "economy",
			name: "sign",
			description: "簽到啊，你覺得是啥？"
		});
	}

	private failMessages = ["啊你今天不是簽到過了嘛？別來煩我 =.=", "找罵啊？給我明天再來", "你到底在幹嘛", "啊啊幹不要再來煩我了", "滾"];

	public async execute(source: Source): Promise<void> {
		await source.defer();
		const p = await UserProfile(source);
		const dp = new Date(p.signLastTimestamp ?? Date.now());
		const dn = new Date();
		const dt = new Date(dn);
		dt.setDate(dt.getDate() + 1);
		dt.setHours(0, 0, 0, 0);
		if (dp.getDay() == dn.getDay()) {
			await source.update(`${randomElement(this.failMessages)}(等待${ms(dt.getTime() - dn.getTime())}再來)`);
			return;
		}

		if (dp.getDay() == dt.getDay()) {
			p.signCombo++;
		} else {
			p.signCombo = 1;
		}

		let isFirstSign = false,
			giveCoin = randomInt(50, 100);

		if (p.lastSign == 0) {
			isFirstSign = true;
			giveCoin = Math.floor(giveCoin * 1.5);
		}

		giveCoin = Math.floor(giveCoin * (p.signCombo * 0.3));

		p.lastSign = Date.now();

		p.signCount++;

		p.coin += giveCoin;

		await source.update({
			embeds: [
				new EmbedBuilder()
					.applySettings(source.member, "簽到成功！")
					.setDescription(
						`${isFirstSign ? "這是你的第一次簽到！" : "你怎麽又來了..."}\n成功獲得：\n金幣 · 1000\n送你一隻鴨子！你現在有${toWords(
							p.signCount
						)}隻鴨子！${isFirstSign ? "" : "\n好啦，拿完快點走開"}`
					)
			]
		});

		await p.save();
	}
}
