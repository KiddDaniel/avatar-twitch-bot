import { Userstate } from "tmi.js";

export interface IChatCommandContext {
    command: IChatCommand;
    sender: Userstate;
    recipients: RegExpMatchArray | null;
    message: string;
}
export interface IChatCommandResult {
    readonly isSuccessful: boolean;
    readonly error?: string;
    readonly messages: string[];
}

export interface IChatCommand {
    readonly trigger: string | string[];
    readonly permittedUsers?: string[];
    readonly allowedForMods?: boolean;
    readonly allowedForSubscriber?: boolean;

    execute: (params: RegExpMatchArray | null, sender?: string) => Promise<IChatCommandResult>;
}
