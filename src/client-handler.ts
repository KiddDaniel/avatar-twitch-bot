import * as tmi from "tmi.js";
import { IChatCommand } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";
import { getTwitchClient, globals } from "./twitch-client";

const availableCommands: IChatCommand[] = [new GreetingCommand()];

export function processClientMessage(target: string, sender: tmi.Userstate, msg: string) {
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
    }

    console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    const commandsWithReceiver = msg.match(/!\w+(\s*@[\w|\d]*)*/g);
    if (!commandsWithReceiver || commandsWithReceiver.length <= 0) {
        console.log(`* command dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
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
        return;
    }

    if (
        !matchingAvailableCommand.permittedUsers?.some((x) => x.toLowerCase() === sender.username?.toLowerCase()) &&
        (matchingAvailableCommand.allowedForMods || matchingAvailableCommand.allowedForSubscriber) &&
        (!(matchingAvailableCommand.allowedForMods && sender.mod) ||
            !(matchingAvailableCommand.allowedForSubscriber && sender.subscriber))
    ) {
        console.log(`* dropping command: no permission ${sender.username}: ${msg}`);
        return;
    }

    const recipients = firstCommandWithReceivers.match(/@[\w|\d]*/g);
    const result = matchingAvailableCommand.execute(recipients, sender.username);

    if (!result.isSuccessful) {
        console.log(result.error);
        return;
    }

    result.messages.forEach((mesg: string) => getTwitchClient().say(globals.channels[0], mesg));
}
