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
    readonly trigger: string[];
    readonly permittedUsers?: string[];
    readonly allowedForMods?: boolean;
    readonly allowedForSubscriber?: boolean;

    execute: (params: string[], sender: string) => Promise<IChatCommandResult>;
}

export function error(s: string | undefined, msg: string) {
    console.log("S", s);
    return {
        isSuccessful: false,
        error: msg,
        messages: s ? [`Hey @${s}, ${msg}`] : [],
    };
}
