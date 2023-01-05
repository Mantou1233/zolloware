import { BaseChannel } from "discord.js";
// import publicPortNo from '../../hznetwork/publicPortNo';

if (!process.env.TEST_CHANNELS) throw new Error("Test channels not configured.");
const testChannelIds = new Set(eval(process.env.TEST_CHANNELS) as string[]);

Object.defineProperties(BaseChannel.prototype, {
	isTestChannel: {
		value: function (this: BaseChannel) {
			return testChannelIds.has(this.id);
		}
	}
});
