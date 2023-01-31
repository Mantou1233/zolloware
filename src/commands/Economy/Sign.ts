import { toWords } from "./../../services/numberToChinese";
import { UserProfile } from "../../classes/Profile";
import { Command } from "../../classes/Command";
import { Source } from "../../classes/Source";
import { CommandType } from "../../typings/enums";
import { EmbedBuilder } from "discord.js";
import ms from "ms";
import randomInt from "@root/src/services/randomInt";

export default class Sign extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Information,
			parent: "economy",
			name: "sign",
			description: "簽到啊，你覺得是啥？"
		});
	}

	// private failMessages = ["啊你今天不是簽到過了嘛？別來煩我 =.=", "沒有", "no", "I SAID NO", "滾"];

	public async execute(source: Source): Promise<void> {
		await source.defer();
		const p = await UserProfile(source);
		const lastSignDate = new Date(p.signLastTimestamp ?? Date.now());
		const todayDate = new Date();
		const tomorrowDate = this.offsetDate(new Date(), 1);
		const yesterdayDate = this.offsetDate(new Date(), -1);
		if (lastSignDate.getDay() == todayDate.getDay()) {
			await source.update(`你今天已經簽到過了！${ms(tomorrowDate.getTime() - todayDate.getTime())}之後再來`);
			return;
		}

		if (lastSignDate.getDay() == yesterdayDate.getDay()) {
			p.signCombo++;
		} else {
			p.signCombo = 1;
		}

		let giveCoin = randomInt(50, 100);

		if (p.signLastTimestamp == -1) {
			giveCoin = Math.floor(giveCoin * 1.5);
		}

		giveCoin = Math.floor(giveCoin * (p.signCombo * 0.3));

		p.signLastTimestamp = Date.now();

		p.signCount++;

		p.coin += giveCoin;

		await source.update({
			embeds: [
				new EmbedBuilder()
					.applySettings(source.member, "簽到成功！")
					.setDescription(`成功獲得：\n金幣 · ${giveCoin}\n送你一隻鴨子！你現在有${toWords(p.signCount)}隻鴨子！\n連續簽到X`)
			]
		});

		await p.save();
	}

	private offsetDate(date: Date, offset: number = 1) {
		date.setDate(date.getDate() + offset);
		date.setHours(0, 0, 0, 0);
		return date;
	}
}
