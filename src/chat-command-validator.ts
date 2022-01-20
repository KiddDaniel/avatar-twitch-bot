import * as tmi from "tmi.js";
import { IChatCommand, IChatCommandContext } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";
import { InventoryCommand } from "./commands/inventory.model";
import { JoinCommand } from "./commands/join.model";
import { LeaveCommand } from "./commands/leave.model";
import { MountCommand } from "./commands/mount.model";
import { PurchaseCommand } from "./commands/purchase.model";
import { StockCommand } from "./commands/stock.model";
import { WalletCommand } from "./commands/wallet";

const availableCommands: IChatCommand[] = [
    new GreetingCommand(),
    new JoinCommand(),
    new LeaveCommand(),
    new PurchaseCommand(),
    new MountCommand(),
    new StockCommand(),
    new InventoryCommand(),
    new WalletCommand(),
];

export function validateCommand(sender: tmi.Userstate, msg: string): IChatCommandContext | undefined {
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return undefined;
    }

    // console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    const commandsWithReceiver = msg.match(/^(!\w+)(\s+@?\w+)*/g);
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

    // split command off
    const recipientsArray = firstCommandWithReceivers.match(/(\s+@?\w+)+/g);
    if (recipientsArray) {
        // tokenize
        const recipients = recipientsArray[0].match(/\w+/g);
        return { command: matchingAvailableCommand, sender, recipients, message: msg };
    }

    // only the command trigger (and the sender)
    return { command: matchingAvailableCommand, sender, recipients: null, message: msg };
}
