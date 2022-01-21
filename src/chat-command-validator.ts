import * as tmi from "tmi.js";
import { IChatCommand, IChatCommandContext } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";
import { InventoryCommand } from "./commands/inventory.model";
import { JoinCommand } from "./commands/join.model";
import { LeaveCommand } from "./commands/leave.model";
import { MountCommand } from "./commands/mount.model";
import { ProfileCommand } from "./commands/profile.model";
import { PurchaseCommand } from "./commands/purchase.model";
import { StatsCommand } from "./commands/stats.model";
import { StockCommand } from "./commands/stock.model";
import { WalletCommand } from "./commands/wallet";

export const availableCommands: IChatCommand[] = [
    new GreetingCommand(),
    new JoinCommand(),
    new LeaveCommand(),
    new PurchaseCommand(),
    new MountCommand(),
    new StockCommand(),
    new InventoryCommand(),
    new WalletCommand(),
    new ProfileCommand(),
    new StatsCommand(),
];

export function validateCommands(sender: tmi.Userstate, msg: string): IChatCommandContext[] {
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return [];
    }

    // console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    const commandsWithReceiver = msg.match(/^(!\w+)(\s+@?\w+)*/g);
    if (!commandsWithReceiver || commandsWithReceiver.length <= 0) {
        console.log(`* command dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return [];
    }

    const contexts: IChatCommandContext[] = [];

    commandsWithReceiver.forEach((command: string) => {
        const commandWithReceivers = command.trim().toLowerCase();
        const matchingAvailableCommand = availableCommands.find((x) =>
            x.trigger.some((trigger) => commandWithReceivers.indexOf(trigger.toLowerCase()) === 0),
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

        // split command off
        const recipientsArray = commandWithReceivers.match(/(\s+@?\w+)+/g);
        let normalizedRecipients: string[] = [];

        if (recipientsArray) {
            // tokenize
            const recps = recipientsArray[0].match(/\w+/g);
            if (recps) {
                normalizedRecipients = recps.map((x) => x.replace("@", ""));
            }
        }

        contexts.push({ command: matchingAvailableCommand, sender, recipients: normalizedRecipients });
    });

    return contexts;
}
