import * as tmi from "tmi.js";
import { validateCommands } from "./chat-command-validator";
import { IChatCommandContext, IChatCommandResult } from "./chat-command.interface";
import { getTwitchClient, globals } from "./twitch-client";

export async function processClientMessage(target: string, sender: tmi.Userstate, msg: string) {
    const contexts: IChatCommandContext[] = validateCommands(sender, msg);

    contexts.forEach(async (context: IChatCommandContext) => {
        const result: IChatCommandResult = await context.command.execute(context.recipients, context.sender.username);
        if (!result.isSuccessful) {
            console.log(result.error);
        }

        result.messages.forEach((mesg: string) => getTwitchClient().say(globals.channels[0], mesg));
    });
}
