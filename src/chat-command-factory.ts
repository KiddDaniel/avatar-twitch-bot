import { IChatCommand } from "./chat-command.interface";
import { DiceCommand } from "./commands/dice.model";
import { GreetingCommand } from "./commands/greeting.model";

export function ChatCommandFactory(trigger: string | string[]): IChatCommand | undefined {
    const availableCommands = [new GreetingCommand(), new DiceCommand()];

    // this more exact check shall ensure we (re)build the same command instance
    const item: IChatCommand | undefined = availableCommands.find(
        (x) =>
            (!Array.isArray(x.trigger) && !Array.isArray(trigger) && x.trigger === trigger) ||
            (Array.isArray(x.trigger) &&
                Array.isArray(trigger) &&
                x.trigger.length === trigger.length &&
                (x.trigger as Array<string>).every((value, index) => value === trigger[index])),
    );

    return item;
}
