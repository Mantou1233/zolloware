import { Command } from "../classes/Command";
import { CommandType } from "../typings/enums";

export default class Diep extends Command<[]> {
	constructor() {
		super({
			type: CommandType.SubcommandGroup,
			name: "economy",
			description: "執行經濟相關的指令",
			aliases: ["eco"]
		});
	}

	public async execute(): Promise<void> {
		throw new Error("Subcommand group is not executable.");
	}
}
