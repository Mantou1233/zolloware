import { Command } from "../classes/Command";
import { Source } from "../classes/Source";
import { CommandType } from "../typings/enums";
import $ from "../services/translatePlaceholder";
// import * as Facts from "../assets/facts";
// import randomElement from "./../services/randomElement";

export default class Ping extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Miscellaneous,
			name: "test",
			description: "敲一下我的大腿看我的反應時間"
		});
	}

	// private facts = [...Facts.Anecdote, ...Facts.Discord, ...Facts.Human, ...Facts.Math, ...Facts.Nature, ...Facts.Subject, ...Facts.World];

	public async execute(source: Source): Promise<void> {
		await source.defer();
		// await source.update(`${randomElement(this.facts)}`);
		await source.update($("%bot.name% ? %bot.a%"));
	}
}
