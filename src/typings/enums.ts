export enum CommandParserOptionResultStatus {
	Pass,
	Required,
	WrongFormat,
	NotInChoices,
	ValueTooSmall,
	ValueTooLarge,
	LengthTooShort,
	LengthTooLong
}

export enum CommandManagerRejectReason {
	TwoFactorRequired,
	BotMissingPermission,
	UserMissingPermission,
	InCooldown,
	IllegalArgument
}

export enum CommandType {
	Fun,
	RPG,
	Essentials,
	Information,
	Miscellaneous,
	SubcommandGroup,
	// 不管上面再多加幾個分類，Developer 永遠都要在最底端
	Developer
}

export enum CommandOptionType {
	Subcommand,
	SubcommandGroup,
	String,
	Emoji,
	Integer,
	Boolean,
	User,
	Member,
	Channel,
	Role,
	Mentionable,
	Number,
	Attachment
}

export enum ArgumentParseType {
	None,
	Split,
	Quote,
	Custom
}

export enum PageSystemMode {
	Description,
	EmbedField
}

export enum PlayMusicResultType {
	StartPlaying,
	AddedToQueue,
	NotInVoiceChannel,
	ResourceNotFound
}

export enum MusicControllerActions {
	Pause,
	Resume,
	Repeat,
	Again,
	NoRepeat,
	Skip,
	Info
}

export enum MusicLoopState {
	Normal,
	Again,
	Loop
}
