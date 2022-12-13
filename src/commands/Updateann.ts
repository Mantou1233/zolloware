import { Command } from "../classes/Command";
import { Source } from "../classes/Source";
import { bot, mainGuild } from "@root/constant.json";
import recentUpdate from "../features/info/recentUpdate";
import { CommandType } from "../utils/enums";

export default class Updateann extends Command<[]> {
  constructor() {
    super({ 
      type: CommandType.Developer, 
      name: 'updateann', 
      description: '正式發布更新公告', 
      aliases: ['ua']
    });
  }

  public async execute(source: Source): Promise<void> {
    await source.hide();
    await source.channel?.send(`<@&${mainGuild.roles.botNotifyId}> HiZollo ${bot.version} 版已發布，以下為更新內容：\n${recentUpdate}`);
    await source.editReply(`更新訊息已成功傳送`);
  }
}