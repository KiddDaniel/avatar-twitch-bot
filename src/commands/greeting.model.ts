import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class GreetingCommand implements IChatCommand {
    trigger = ["!greeting", "!greetings"];

    async execute(recipient: string | string[] | null): Promise<IChatCommandResult> {
        if (!recipient || recipient.length <= 0) return { isSuccessful: false, error: "no recipient" };

        let normalizedRecipients: string[] = [];
        if (Array.isArray(recipient)) {
            normalizedRecipients = recipient.map((x) => x.replace("@", ""));
        } else {
            normalizedRecipients = [recipient.replace("@", "")];
        }

        normalizedRecipients.forEach((rec) => getTwitchClient().say(globals.channels[0], `Hey Greetings to @${rec}`));

        return { isSuccessful: true };
    }
}
