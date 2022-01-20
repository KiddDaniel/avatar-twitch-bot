import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { CommandBase } from "./base.model";

export class GreetingCommand extends CommandBase implements IChatCommand {
    trigger = ["!greeting", "!greetings"];

    async execute(recipients: string[]): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        recipients.forEach((rec) => ret.messages.push(`Hey Greetings to @${rec}`));
        return ret;
    }
}
