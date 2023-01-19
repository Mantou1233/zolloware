import { Client } from "discord.js";

Object.defineProperties(Client.prototype, {
	block: {
		value: function (this: Client, userId: string): void {
			this.blockedUsers.add(userId);
		}
	},

	unblock: {
		value: function (this: Client, userId: string): void {
			this.blockedUsers.delete(userId);
		}
	}
});
