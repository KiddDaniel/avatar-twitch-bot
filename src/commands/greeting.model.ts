import { IChatCommand, IChatCommandResult } from "../chat-command.interface";

// this totally defeats the purpose of having a class method... sigh. Thank you JSON for nothing.
export function executeCommand(command: IChatCommand, recipient: string | string[] | null, sender?: string) {
    if (!recipient || recipient.length <= 0) return { isSuccessful: false, error: "no recipient", messages: [] };

    let normalizedRecipients: string[] = [];
    if (Array.isArray(recipient)) {
        normalizedRecipients = recipient.map((x) => x.replace("@", ""));
    } else {
        normalizedRecipients = [recipient.replace("@", "")];
    }

    const messages: string[] = [];
    // normalizedRecipients.forEach((rec) => client.say(globals.channels[0], `Hey Greetings to @${rec}`));
    normalizedRecipients.forEach((rec) => messages.push(`Hey Greetings to @${rec} from ${sender}`));
    return { isSuccessful: true, messages };
}

export class GreetingCommand implements IChatCommand {
    trigger = ["!greeting", "!greetings"];

    execute(recipient: string | string[] | null, sender?: string): IChatCommandResult {
        return executeCommand(this, recipient, sender);
    }
}
