import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { CommandBase } from "./base.model";

export class GreetingCommand extends CommandBase implements IChatCommand {
    trigger = ["!greeting", "!greetings"];

    async execute(recipient: string | string[] | null, sender?: string): Promise<IChatCommandResult> {
        if (!recipient || recipient.length <= 0) return this.error(sender, "No recipient specified.");

        let normalizedRecipients: string[] = [];
        if (Array.isArray(recipient)) {
            normalizedRecipients = recipient.map((x) => x.replace("@", ""));
        } else {
            normalizedRecipients = [recipient.replace("@", "")];
        }

        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };

        normalizedRecipients.forEach((rec) => ret.messages.push(`Hey Greetings to @${rec}`));

        return ret;
    }
}
