export interface IChatCommandContext {
    command: IChatCommand;
    sender: string;
    recipients: RegExpMatchArray | null;
}

export interface IChatCommandJob {
    readonly context: IChatCommandContext;
    execute: () => IChatCommandResult;
}

export interface IChatCommandResult {
    readonly messages: string[];
    readonly isSuccessful: boolean;
    readonly error?: string;
}

export interface IChatCommand {
    readonly trigger: string | string[];
    readonly permittedUsers?: string[];
    readonly allowedForMods?: boolean;
    readonly allowedForSubscriber?: boolean;

    execute: (params: string | string[] | null, sender?: string) => IChatCommandResult;
}
