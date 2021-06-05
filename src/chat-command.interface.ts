export interface IChatCommandResult {
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
