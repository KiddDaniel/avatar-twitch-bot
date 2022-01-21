import { IChatCommand, IChatCommandResult } from "../chat-command.interface";

export class GreetingCommand implements IChatCommand {
    trigger = ["!greeting", "!greetings"];

    async execute(recipients: string[]): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        recipients.forEach((rec) => ret.messages.push(`Hey Greetings to @${rec}`));
        return ret;
    }
}
