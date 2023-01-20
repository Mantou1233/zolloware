import { Database } from "quickmongo";
import config from "@root/config";

const UserSchema = {
	ducks: 0
} satisfies UserSchema;

const GuildSchema = {
	ducks: 0
} satisfies GuildSchema;

interface UserSchema {
	ducks: number;
}

interface GuildSchema {
	ducks: number;
}

export const db = new Database(config.database.key, {
	collectionName: "zolloware"
});

export class Profile<T extends { [key: string]: any } = { [key: string]: any }> {
	__id: string;
	__prefix: string;
	__schema: T;

	[key: string]: any;

	constructor(id: string, prefix: string, schema: T) {
		this.__id = id;
		this.__schema = schema;
		this.__prefix = `${prefix}:`;
	}

	public async init() {
		const data = (await db.get(`${this.__prefix}${this.__id}`)) ?? -1;
		if (data == -1) return this;
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		return this;
	}

	public async check(): Promise<boolean> {
		return (await db.get(`${this.__prefix}${this.__id}`)) ? true : false;
	}

	public async checkAndUpdate(): Promise<true> {
		if (!(await this.check())) {
			await this.newSchema();
		}
		this.updateSchema();
		return true;
	}

	public get db() {
		return db;
	}

	public async newSchema() {
		if (!this.__schema) return false;
		Object.assign(this, this.__schema);
		return void this.save();
	}

	public async updateSchema() {
		if (!this.__schema) return false;
		let raw = this.raw;
		Object.assign(this, this.__schema, raw);
		return this.save();
	}

	public async save() {
		return void (await db.set(`${this.__prefix}${this.__id}`, this.raw)) ?? this;
	}

	public get raw() {
		const data = JSON.parse(JSON.stringify(this));
		delete data["__id"];
		delete data["__schema"];
		delete data["__prefix"];
		return data;
	}
}

export async function GuildProfile(id: any): Promise<Profile<UserSchema> & { [K in keyof GuildSchema]: GuildSchema[K] }> {
	return (await new Profile<GuildSchema>(id?.source?.guild?.id ?? id?.guild?.id ?? id, "guild", GuildSchema).init()) as unknown as Profile<UserSchema> & {
		[K in keyof GuildSchema]: GuildSchema[K];
	};
}

export async function UserProfile(id: any): Promise<Profile<UserSchema> & { [K in keyof UserSchema]: UserSchema[K] }> {
	return (await new Profile<UserSchema>(
		id?.source?.member?.user?.id ?? id?.author?.id ?? id?.user?.id ?? id,
		"user",
		UserSchema
	).init()) as unknown as Profile<UserSchema> & {
		[K in keyof UserSchema]: UserSchema[K];
	};
}
