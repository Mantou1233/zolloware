import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../classes/Command";
import { Source } from "../classes/Source";
import { ArgumentParseType, CommandType } from "../utils/enums";

export default class Vote extends Command<string[]> {
  constructor() {
    super({
      type: CommandType.Utility, 
      name: 'vote', 
      description: '讓我幫你發起一場投票', 
      options: [{ 
        type: ApplicationCommandOptionType.String, 
        name: '主題', 
        description: '投票的主題', 
        required: true
      }, {
        type: ApplicationCommandOptionType.String, 
        name: '選項%i', 
        description: '投票的選項', 
        required: false, 
        repeat: true
      }], 
      argumentParseMethod: {
        type: ArgumentParseType.Quote, 
        quotes: ['`', '`']
      }, 
      permissions: {
        bot: [PermissionFlagsBits.EmbedLinks]
      }
    });
  }

  public async execute(source: Source, [topic, ...options]: string[]): Promise<void> {
    const alphabets = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
    options = options.filter(a => a != null)
      .filter((option, i, arr) => i === arr.findIndex(o => o === option))
      .map((o, i) => `${alphabets[i]} ${o}`);
    
    if (options.length < 2) {
      await source.defer({ ephemeral: true });
      await source.update('你需要提供至少兩個不重複的選項');
      return;
    }
    if (options.length > 20) {
      await source.defer({ ephemeral: true });
      await source.update('選項的數量不能超過 20 個');
      return;
    }
    
    await source.defer();

    const helper = new EmbedBuilder()
      .applyHiZolloSettings(source.member, 'HiZollo 的投票中心')
      .setDescription(options.join('\n'))
      .setTimestamp()
      .setTitle(topic);

    await source.update({ embeds: [helper] }).then(async msg => {
      for (var i = 0; i < options.length; i++)
        await msg.react(alphabets[i]);
    });
  }
}