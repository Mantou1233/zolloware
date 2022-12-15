import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { APIWebhook } from "discord-api-types/v10";
import "dotenv/config";

(async () => {
	if (!process.env.TOKEN) {
		console.error(
			"Please configure your bot token in .env before registering webhook"
		);
		process.exit(1);
	}

	const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
	const channelId = process.argv[2];

	if (!channelId) {
		console.error("Please provide the id of target channel");
		process.exit(1);
	}

	const name = process.argv[3] ?? "My Sweet Webhook";

	try {
		const res = (await rest.post(Routes.channelWebhooks(channelId), {
			body: { name }
		})) as APIWebhook;

		console.log(`Name: ${res.name}`);
		console.log(
			`URL: https://discord.com/api/webhooks/${res.id}/${res.token}`
		);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
