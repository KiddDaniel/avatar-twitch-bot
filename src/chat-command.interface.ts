import { Userstate } from "tmi.js";

export interface IChatCommandContext {
    command: IChatCommand;
    sender: Userstate;
    recipients: string[];
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

    execute: (params: string[], sender: string) => Promise<IChatCommandResult>;
}
