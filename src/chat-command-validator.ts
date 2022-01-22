import * as tmi from "tmi.js";
import { IChatCommand, IChatCommandContext } from "./chat-command.interface";
import { GreetingCommand } from "./commands/greeting.model";
import { InventoryCommand } from "./commands/inventory.model";
import { JoinCommand } from "./commands/join.model";
import { LeaveCommand } from "./commands/leave.model";
import { MountCommand } from "./commands/mount.model";
import { NvNCommand } from "./commands/nvn.model";
import { ProfileCommand } from "./commands/profile.model";
import { PurchaseCommand } from "./commands/purchase.model";
import { PvECommand } from "./commands/pve.model";
import { StatsCommand } from "./commands/stats.model";
import { StockCommand } from "./commands/stock.model";
import { WalletCommand } from "./commands/wallet";
import { YipYipCommand } from "./commands/yipyip.model";
import { globals } from "./twitch-client";

// works, atleast... node-fetch didnt look so good here...
const axios = require("axios").default;

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
    new YipYipCommand(),
    new PvECommand(),
    new NvNCommand(),
];

// disable camel case linter check here, those identifiers come from twitch
export interface IFollower {
    // eslint-disable-next-line camelcase
    from_id: string;
    // eslint-disable-next-line camelcase
    from_login: string;
    // eslint-disable-next-line camelcase
    from_name: string;
    // eslint-disable-next-line camelcase
    to_id: string;
    // eslint-disable-next-line camelcase
    to_name: string;
    // eslint-disable-next-line camelcase
    followed_at: string;
}

export interface IFollowers {
    total: number;
    data: IFollower[];
}

export async function checkFollower(user: string, channel: string): Promise<boolean> {
    const url: string = `https://api.twitch.tv/helix/users/follows?to_id=${channel}`; // helix is the new Twitch API
    const token: string = globals.identity.password.toLowerCase().replace("oauth:", "");
    const res = await axios.get(url, {
        headers: {
            Accept: "application/vnd.twitchtv.v5+json",
            Authorization: `Bearer ${token}`, // here goes the oauth token
            "Client-ID": globals.identity.username, // nope you need a proper Client ID !!!
        },
    });

    // potentially a large array and hence a long iteration duration ...
    // can we just break here if the follower has been found ?
    let follower: IFollower;
    const data: IFollowers = (await res.json()) as IFollowers;
    for (let i = 0; i < data.total; i++) {
        follower = data.data[i];
        if (follower.from_login === user) {
            return true;
        }
    }
    return false;
}

export async function checkPermissions(command: IChatCommand, sender: tmi.Userstate): Promise<boolean> {
    let perm: boolean = true;
    console.log(command);

    perm =
        perm &&
        ((command.permittedUsers &&
            command.permittedUsers.some((x) => x.toLowerCase() === sender.username?.toLowerCase())) ||
            command.permittedUsers === undefined);
    console.log(perm);
    perm = perm && ((command.allowedForMods && sender.mod) || command.allowedForMods === undefined);
    console.log(perm);
    perm = perm && ((command.allowedForSubscriber && sender.subscriber) || command.allowedForSubscriber === undefined);
    perm =
        perm &&
        ((command.allowedForStreamer && sender.username === globals.storage.data.channel) ||
            command.allowedForStreamer === undefined);
    console.log(perm);
    // disabled until we agreed which account to use and what / how to register with twitch
    /* perm =
        perm &&
        ((command.allowedForFollower && (await checkFollower(sender.username, globals.storage.data.channel))) ||
            command.allowedForFollower === undefined);
    console.log(perm); */

    return perm;
}

export async function validateCommands(sender: tmi.Userstate, msg: string): Promise<IChatCommandContext[]> {
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

    commandsWithReceiver.forEach(async (command: string) => {
        const commandWithReceivers = command.trim().toLowerCase();
        const matchingAvailableCommand = availableCommands.find((x) =>
            x.trigger.some((trigger) => commandWithReceivers.indexOf(trigger.toLowerCase()) === 0),
        );

        if (!matchingAvailableCommand) {
            console.log("* dropping command: no handler found");
            return;
        }

        const allowed: boolean = await checkPermissions(matchingAvailableCommand, sender);

        if (!allowed) {
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
