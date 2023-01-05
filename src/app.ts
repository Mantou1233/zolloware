/*************************************************************************
 ******************* Project     : Junior HiZollo       *******************
 ******************* Author      : HiZollo Organization *******************
 ******************* Version     : 1.1.1                *******************
 ******************* Release Date: 2022/10/05           *******************
 *************************************************************************/

/******************* 系統變數設置 *******************/
import { ApplicationCommandOptionType, EmbedBuilder, GatewayIntentBits, Options } from "discord.js";
import "./djsAddon";
import config from "@root/config";
import { ExtendedClient } from "./classes/ExtendedClient";
import { CommandManagerRejectReason, CommandParserOptionResultStatus } from "./typings/enums";
const client = new ExtendedClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	],
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ApplicationCommandManager: 0,
		BaseGuildEmojiManager: 0,
		GuildBanManager: 0,
		GuildEmojiManager: 0,
		GuildInviteManager: 0,
		GuildScheduledEventManager: 0,
		GuildStickerManager: 0,
		MessageManager: 0,
		PresenceManager: 0,
		ReactionManager: 0,
		ReactionUserManager: 0,
		ThreadManager: 0,
		ThreadMemberManager: 0,
		UserManager: 0
	}),
	devMode: process.argv[2]?.toLowerCase() === "dev"
});

/******************* Features *******************/
import { Translator } from "./classes/Translator";
/**/

/******************* 指令失敗 *******************/
client.commands.on("reject", async (source, info) => {
	await source.defer({ ephemeral: true });
	const helper = new EmbedBuilder().applySettings(source.member, "HiZollo 的幫助中心");

	switch (info.reason) {
		case CommandManagerRejectReason.Angry:
			helper.setTitle("(ﾒﾟДﾟ)ﾒ").setDescription(`你就是剛剛丟我的那個人！我才不想理你勒，你 ${~~(info.args[0] / 1000)} 秒之後再來跟我談！`);
			break;

		case CommandManagerRejectReason.TwoFactorRequired:
			helper.setTitle("2FA 不讓我執行這個指令").setDescription(`因為這個伺服器開啟了 2FA 驗證，所以我無法執行這個指令`);
			break;

		case CommandManagerRejectReason.UserMissingPermission:
			helper
				.setTitle("你被權限之神禁錮了")
				.setDescription(`以下是你缺少的權限\n\n${info.args[0].map(perm => `- ${Translator.getPermissionChinese(perm)}`).join("\n")}`);
			break;

		case CommandManagerRejectReason.BotMissingPermission:
			helper
				.setTitle("給我這麼點權限怎麼夠我用")
				.setDescription(
					`我把我要的權限都列出來了，快點給我不然我沒辦法幫你執行這個指令\n\n${info.args[0]
						.map(perm => `- ${Translator.getPermissionChinese(perm)}`)
						.join("\n")}`
				);
			break;

		case CommandManagerRejectReason.InCooldown:
			helper.setTitle("你太快了").setDescription(`你必須在 ${~~(info.args[0] / 1000)} 秒後才能再使用此指令。`);
			break;

		case CommandManagerRejectReason.IllegalArgument:
			const [commandName, options, { arg, index, status }] = info.args;

			let description = options
				.map((o, i) => {
					const text = o.repeat
						? new Array(2)
								.fill(o.name)
								.map((e, i) => e.replaceAll("%i", (i + 1).toString()))
								.join(" ") + " ..."
						: o.name;
					const indexRange = o.repeat ? (source.isMessage() ? Infinity : 5) : 0;
					return index <= i && i <= index + indexRange ? `[${text}]` : text;
				})
				.join(" ");
			description = `\`\`\`css\n/${commandName[0]}${commandName[1] ? ` ${commandName[1]}` : ""} ${description}\n\`\`\`\n`;

			const displayName = options[index].repeat ? options[index].name.replaceAll("%i", "") : options[index].name;
			let limit: number;
			switch (status) {
				case CommandParserOptionResultStatus.Required:
					helper.setTitle(`參數 ${displayName} 是必填的`);
					break;

				case CommandParserOptionResultStatus.WrongFormat:
					helper.setTitle(`參數 ${displayName} 的格式錯誤`);
					description += `${arg} 不符合${Translator.getCommandOptionTypeChinese(options[index])}`;
					if (options[index].type === ApplicationCommandOptionType.Boolean) description += `（是或否）`;
					description += `的格式`;
					break;

				case CommandParserOptionResultStatus.NotInChoices:
					if (!("choices" in info.args[2])) break;
					const { choices } = info.args[2];
					const choicesString = choices
						.map(({ name: n, value: v }) => (n === v.toString() ? `\`${n}\`` : `\`${n}\`/\`${v}\``))
						.flat()
						.join("．");
					helper.setTitle(`${arg} 並不在規定的選項內`);
					description += `參數 ${displayName} 必須是下列選項中的其中一個：\n${choicesString}`;
					break;

				case CommandParserOptionResultStatus.ValueTooSmall:
					if (!("limit" in info.args[2])) break;
					({ limit } = info.args[2]);
					helper.setTitle(`參數 ${displayName} 太小了`);
					description += `這個參數必須比 ${limit} 還要大，但你給了 ${arg}`;
					break;

				case CommandParserOptionResultStatus.ValueTooLarge:
					if (!("limit" in info.args[2])) break;
					({ limit } = info.args[2]);
					helper.setTitle(`參數 ${displayName} 太大了`);
					description += `這個參數必須比 ${limit} 還要小，但你給了 ${arg}`;
					break;

				case CommandParserOptionResultStatus.LengthTooShort:
					if (!("limit" in info.args[2])) break;
					({ limit } = info.args[2]);
					helper.setTitle(`參數 ${displayName} 太短了`);
					description += `這個參數的長度必須比 ${limit} 還要長，但你給的 ${arg} 的長度只有 ${(arg as string).length}`;
					break;

				case CommandParserOptionResultStatus.LengthTooLong:
					if (!("limit" in info.args[2])) break;
					({ limit } = info.args[2]);
					helper.setTitle(`參數 ${displayName} 太長了`);
					description += `這個參數的長度必須比 ${limit} 還要短，但你給的 ${arg} 的長度卻是 ${(arg as string).length}`;
					break;
			}
			helper.setDescription(description);
			break;
	}

	await source.update({ embeds: [helper] });
});
/**/

/******************* 指令無效 *******************/
client.commands.on("unavailable", async source => {
	await source.defer({ ephemeral: true });
	await source.temp("這個指令目前無法使用，這通常是因為這個指令正在更新，稍待片刻後就能正常使用了");
});
/**/

/******************* 指令執行 *******************/
client.commands.on("executed", (source, commandName, ...args) => {
	client.logger.commandExecuted(source, commandName, ...args);
});
/**/

/******************* 隱藏指令執行 *******************/
client.triggers.on("executed", (message, commandName) => {
	client.logger.triggerExecuted(message, commandName);
});
/**/

/******************* 上線確認 *******************/
client.on("ready", () => {
	client.logger.ready();
	client.initialize();
});
/**/

/******************* 如果出錯 *******************/
client.on("error", error => {
	client.logger.error(error);
});
client.commands.on("error", (_commandName, error) => {
	client.logger.error(error);
});
process.on("uncaughtException", error => {
	client.logger.error(error);
});
/**/

/******************* 訊息創建 *******************/
client.on("messageCreate", message => {
	client.addonCommand(message);
	client.randomReact(message);
	client.poll(message);
	client.commands.onMessageCreate(message);
	client.triggers.onMessageCreate(message);
});
/**/

/******************* 指令互動 *******************/
client.on("interactionCreate", interaction => {
	client.autocomplete.onInteractionCreate(interaction);
	client.buttons.onInteractionCreate(interaction);
	client.commands.onInteractionCreate(interaction);
	client.selectmenus.onInteractionCreate(interaction);
});
/**/

/******************* 加入伺服器 *******************/
client.on("guildCreate", guild => {
	client.logger.joinGuild(guild);
});
/**/

/******************* 刪除伺服器 *******************/
client.on("guildDelete", guild => {
	client.logger.leaveGuild(guild);
});
/**/

/******************* 登入機器人 *******************/
client.login(config.bot.token);
/**/
