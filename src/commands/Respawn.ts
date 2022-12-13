import { Command } from "../classes/Command";
import { CommandType } from "../utils/enums";
import { Source } from "../classes/Source";
import { ApplicationCommandOptionType } from "discord.js";

export default class Respawn extends Command<[number]> {
  constructor() {
    super({ 
      type: CommandType.Developer, 
      name: 'respawn', 
      description: '重新生成所有分支', 
      aliases: ['rsp'], 
      options: [{
        type: ApplicationCommandOptionType.Number, 
        name: '分支', 
        description: '要重生的分支 ID', 
        required: false
      }]
    });
  }

  public async execute(source: Source, [shardId]: [number]): Promise<void> {
    await source.hide();

    if (shardId === null) {
      await source.update(`已開始重生所有分支`);
      await source.client.shard?.respawnAll();
    }
    else {
      await source.update(`已開始重生 ${shardId} 號分支`);
      source.client.shard!.broadcastEval((client, { shardId }) => {
        if (client.shard!.ids.includes(shardId)) process.exit();
      }, { context: { shardId } });
    }
  }
}