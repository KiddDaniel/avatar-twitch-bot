import { IPlayer, Rank } from "../player.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { Shoe } from "../items/slots/shoe";
import { Upkeep } from "../items/slots/upkeep";
import { Chest } from "../items/slots/chest";
import { Mount } from "../items/slots/mount";
import { Pants } from "../items/slots/pants";
import { Coat } from "../items/slots/coat";
import { Hat } from "../items/slots/hat";
import { INation } from "../nation.interface";
import { calculate, IStats } from "../stats.interface";
import { IInventory } from "../inventory.interface";

export class JoinCommand implements IChatCommand {
    trigger = ["!join"];

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
        const s: string = sender;
        const { data } = globals.storage;

        // dev permission check
        if (data.devs.includes(s)) {
            if (normalizedRecipients.length === 2) {
                const user: string = normalizedRecipients[0];
                const nation: string = normalizedRecipients[1];
                return this.handlePlayerRegistration(s, user, nation);
            }

            if (normalizedRecipients.length === 1) {
                // devs can self-register
                const user: string = s;
                const nation: string = normalizedRecipients[0];
                return this.handlePlayerRegistration(s, user, nation);
            }

            return error(
                s,
                "Please specify a nation (or user and nation as dev) to register yourself or another new player",
            );
        }
        if (normalizedRecipients.length === 1) {
            const nation: string = normalizedRecipients[0];
            return this.showRegistrationInfo(s, nation);
        }

        return error(s, "Please specify nation as user to apply for registration into a nation by a dev");
    }

    async handlePlayerRegistration(sender: string, user: string, nation: string): Promise<IChatCommandResult> {
        // potentially many players, would be slow to iterate over the whole array to find them
        // better keep this a record here
        const { data } = globals.storage;
        if (user in data.players) {
            return error(user, `You are already registered as player.`);
        }

        const inventory: IInventory = {
            slots: {
                upkeep: new Upkeep(),
                mount: new Mount(),
                shoe: new Shoe(),
                chest: new Chest(),
                pants: new Pants(),
                coat: new Coat(),
                hat: new Hat(),
            },
        };

        const stats: IStats = {
            base: {
                boldness: 1,
                intelligence: 1,
                intuition: 1,
                charisma: 1,
                dexterity: 1,
                constitution: 1,
                strength: 1,
            },
            calc: {},
        };

        const player: IPlayer = {
            isRegistered: true,
            isDeveloper: data.devs.includes(user),
            name: user,
            nation,
            stats,
            inventory,
            wallet: 2500, // start money
            xp: 0,
            level: 1,
            threshold: 50,
            rank: Rank.newbie,
            cooldown: {},
        };

        calculate(player.stats);

        // do nation check, what to do when already associated ?
        let inOtherNation: boolean = false;
        let destiNation: INation | undefined;
        const nationNames: Array<string> = [];
        data.nations.forEach((n: INation) => {
            if (n.name === nation) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                destiNation = n;
                if (n.members.includes(user)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    inOtherNation = true;
                }
                nationNames.push(n.name);
            }
        });

        if (destiNation === undefined) {
            return error(user, `Valid nations to join are: ${nationNames}`);
        }

        if (inOtherNation) {
            return error(user, `You are already registered in the nation of ${nation}`);
        }
        destiNation.members.push(user);
        data.players[user] = player;
        await globals.storage.save();
        return {
            isSuccessful: true,
            messages: [`Hey @${user}, you are now registered in the nation of ${destiNation.name}`],
        };
    }

    showRegistrationInfo(sender: string, nation: string): IChatCommandResult {
        const { data } = globals.storage;
        const url: string = "https://avatar-twitch-bot.com/register";
        const nationNames: Array<string> = [];
        data.nations.forEach((n: INation) => {
            if (n.name === nation) {
                nationNames.push(n.name);
            }
        });

        if (nation in data.nations) {
            return {
                isSuccessful: true,
                messages: [`Hey @${sender},you can register in the nation of ${nation} under ${url}`],
            };
        }

        return error(sender, `Valid nations to join are: ${nationNames}`);
    }
}
