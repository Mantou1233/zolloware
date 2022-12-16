import { HZClient } from "../classes/HZClient";
import { CommandType } from "../typings/enums";
import { AutocompleteData } from "../typings/types";

export default function (client: HZClient): AutocompleteData {
	return {
		指令名稱: [
			...client.commands.map((command, commandName) => {
				return {
					name: commandName,
					devOnly: command.type === CommandType.Developer
				};
			}),
			...client.commands.subcommands.map((group, commandName) => {
				return {
					name: commandName,
					devOnly: group.data.some(command => command.type !== CommandType.Developer)
				};
			})
		]
	};
}
