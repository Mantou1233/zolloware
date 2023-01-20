import { UserProfile } from "../../classes/Profile";
import { Command } from "../../classes/Command";
import { Source } from "../../classes/Source";
import { CommandType } from "../../typings/enums";

export default class DiepServer extends Command<[]> {
	constructor() {
		super({
			type: CommandType.Information,
			parent: "economy",
			name: "test",
			description: "ow"
		});
	}

	public async execute(source: Source): Promise<void> {
		const g = await UserProfile(source);
		await source.defer();
		g.ducks++;
		await source.update(`duck is ${g.ducks}! (${await g.db.ping()} ms)`);
		g.save();
	}
}
