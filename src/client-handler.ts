import * as tmi from "tmi.js";
import { IChatCommand } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";
import { JoinCommand } from "./commands/join.model";
import { LeaveCommand } from "./commands/leave.model";

const availableCommands: IChatCommand[] = [new GreetingCommand(), new JoinCommand(), new LeaveCommand()];

export function processClientMessage(target: string, sender: tmi.Userstate, msg: string) {
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
    }

    // console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    // const commandsWithReceiver = msg.match(/!\w+(\s*@?[\w|\d]*)*/g);
    const commandsWithReceiver = msg.match(/^(!\w+)(\s?@?\w+)*/g);
    if (!commandsWithReceiver || commandsWithReceiver.length <= 0) {
        console.log(`* command dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
    }

    const firstCommandWithReceivers = commandsWithReceiver[0].trim().toLowerCase();
    // console.log(commandsWithReceiver, firstCommandWithReceivers);
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

    // const recipients = firstCommandWithReceivers.match("/@[\w|\d]*/g");
    // split command off
    const recipientsArray = firstCommandWithReceivers.match(/(\s@?\w+)+/g);
    if (recipientsArray) {
        // tokenize
        const recipients = recipientsArray[0].match(/\w+/g);
        matchingAvailableCommand.execute(recipients, sender.username);
    } else {
        // only the command trigger (and the sender)
        matchingAvailableCommand.execute(recipientsArray, sender.username);
    }
}
