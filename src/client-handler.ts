import * as tmi from "tmi.js";
import { validateCommand } from "./chat-command-validator";
import { IChatCommandContext } from "./chat-command.interface";
import { getTwitchClient, globals, sleep } from "./twitch-client";

export function processClientMessage(target: string, sender: tmi.Userstate, msg: string) {
    const context: IChatCommandContext | undefined = validateCommand(target, sender, msg);

    if (context === undefined) {
        return;
    }

    sleep(globals.timeout).then(() => {
        const result = context.command.execute(context.recipients, context.sender);

        if (!result.isSuccessful) {
            console.log(result.error);
            return;
        }

        result.messages.forEach((mesg: string) => getTwitchClient().say(globals.channels[0], mesg));
    });
}
