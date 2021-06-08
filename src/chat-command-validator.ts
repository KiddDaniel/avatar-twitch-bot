import * as tmi from "tmi.js";
import { IChatCommand, IChatCommandContext } from "./chat-command.interface";
import { DiceCommand } from "./commands/dice.model";
import { GreetingCommand } from "./commands/greeting.model";

const availableCommands: IChatCommand[] = [new GreetingCommand(), new DiceCommand()];

export function validateCommand(target: string, sender: tmi.Userstate, msg: string): IChatCommandContext | undefined {
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return undefined;
    }

    console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    const commandsWithReceiver = msg.match(/!\w+(\s*@[\w|\d]*)*/g);
    if (!commandsWithReceiver || commandsWithReceiver.length <= 0) {
        console.log(`* command dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return undefined;
    }

    const firstCommandWithReceivers = commandsWithReceiver[0].trim().toLowerCase();
    const matchingAvailableCommand = availableCommands.find(
        (x) =>
            (!Array.isArray(x.trigger) && firstCommandWithReceivers.indexOf(x.trigger.toLowerCase()) === 0) ||
            (Array.isArray(x.trigger) &&
                x.trigger.some((trigger) => firstCommandWithReceivers.indexOf(trigger.toLowerCase()) === 0)),
    );

    if (!matchingAvailableCommand) {
        console.log("* dropping command: no handler found");
        return undefined;
    }

    if (
        !matchingAvailableCommand.permittedUsers?.some((x) => x.toLowerCase() === sender.username?.toLowerCase()) &&
        (matchingAvailableCommand.allowedForMods || matchingAvailableCommand.allowedForSubscriber) &&
        (!(matchingAvailableCommand.allowedForMods && sender.mod) ||
            !(matchingAvailableCommand.allowedForSubscriber && sender.subscriber))
    ) {
        console.log(`* dropping command: no permission ${sender.username}: ${msg}`);
        return undefined;
    }

    const recipients = firstCommandWithReceivers.match(/@[\w|\d]*/g);

    return { command: matchingAvailableCommand, sender: sender.username, recipients };
}
