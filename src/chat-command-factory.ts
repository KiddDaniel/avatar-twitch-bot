import { IChatCommand } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";

export function ChatCommandFactory(cmd: IChatCommand): IChatCommand | undefined {
    type ChatCommandItem = { trigger: string | string[]; command: IChatCommand };
    const availableCommands: Array<ChatCommandItem> = [
        { trigger: ["!greeting", "!greetings"], command: new GreetingCommand() },
    ];

    const item: ChatCommandItem | undefined = availableCommands.find(
        (x) =>
            (!Array.isArray(x.trigger) && !Array.isArray(cmd.trigger) && x.trigger === cmd.trigger) ||
            (Array.isArray(x.trigger) &&
                Array.isArray(cmd.trigger) &&
                x.trigger.length === cmd.trigger.length &&
                (x.trigger as Array<string>).every((value, index) => value === cmd.trigger[index])),
    );

    return item ? item.command : undefined;
}
