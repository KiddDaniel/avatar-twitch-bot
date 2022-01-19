import { IPlayer } from "../player.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";
import { Shoe } from "../items/slots/shoe";
import { Upkeep } from "../items/slots/upkeep";
import { Chest } from "../items/slots/chest";
import { Mount } from "../items/slots/mount";
import { Pants } from "../items/slots/pants";
import { Coat } from "../items/slots/coat";
import { Hat } from "../items/slots/hat";
import { INation } from "../nation.interface";

export class JoinCommand implements IChatCommand {
    trigger = "!join";

    error(s: string, msg: string): IChatCommandResult {
        getTwitchClient().say(globals.channels[0], `Hey @${s}, ${msg}`);

        return {
            isSuccessful: false,
            error: msg,
        };
    }

    execute(recipient: string | string[] | null, sender?: string): IChatCommandResult {
        if (sender === undefined) return { isSuccessful: false, error: "no sender" };

        let normalizedRecipients: string[] = [];
        if (recipient) {
            if (Array.isArray(recipient)) {
                normalizedRecipients = recipient.map((x) => x.replace("@", ""));
            } else {
                normalizedRecipients = [recipient.replace("@", "")];
            }
        }

        const s: string = sender;

        // dev permission check
        if (globals.storage.devs.includes(s)) {
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

            return this.error(
                s,
                "Please specify a nation (or user and nation as dev) to register yourself or another new player",
            );
        }
        if (normalizedRecipients.length === 1) {
            const nation: string = normalizedRecipients[0];
            return this.showRegistrationInfo(s, nation);
        }

        return this.error(s, "Please specify nation as user to apply for registration into a nation by a dev");
    }

    handlePlayerRegistration(sender: string, user: string, nation: string): IChatCommandResult {
        // potentially many players, would be slow to iterate over the whole array to find them
        // better keep this a record here
        if (user in globals.storage.players) {
            return this.error(user, `You are already registered as player.`);
        }

        const player: IPlayer = {
            isRegistered: true,
            isDeveloper: globals.storage.devs.includes(user),
            name: user,
            nation,
            // TODO set stats here and possible start items
            stats: {
                base: {
                    level: 1,
                    boldness: 1,
                    intelligence: 1,
                    intuition: 1,
                    charisma: 1,
                    dexterity: 1,
                    constitution: 1,
                    strength: 1,
                },
            },
            inventory: {
                slots: {
                    upkeep: new Upkeep(),
                    mount: new Mount(),
                    shoe: new Shoe(),
                    chest: new Chest(),
                    pants: new Pants(),
                    coat: new Coat(),
                    hat: new Hat(),
                },
            },
            wallet: 2500, // start money
        };

        // do nation check, what to do when already associated ?
        let inOtherNation: boolean = false;
        let destiNation: INation | undefined;
        const nationNames: Array<string> = [];
        globals.storage.nations.forEach((n: INation) => {
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
            return this.error(user, `Valid nations to join are: ${nationNames}`);
        }

        if (inOtherNation) {
            return this.error(user, `You are already registered in the nation of ${nation}`);
        }
        destiNation.members.push(user);
        globals.storage.players[user] = player;
        globals.storage.save();
        getTwitchClient().say(
            globals.channels[0],
            `Hey @${user}, 
            you are now registered in the nation of ${destiNation.name}`,
        );

        return { isSuccessful: true };
    }

    showRegistrationInfo(sender: string, nation: string): IChatCommandResult {
        const url: string = "https://avatar-twitch-bot.com/register";
        const nationNames: Array<string> = [];
        globals.storage.nations.forEach((n: INation) => {
            if (n.name === nation) {
                nationNames.push(n.name);
            }
        });

        if (nation in globals.storage.nations) {
            getTwitchClient().say(
                globals.channels[0],
                `Hey @${sender}, 
                you can register in the nation of ${nation} under ${url}`,
            );
            return { isSuccessful: true };
        }

        return this.error(sender, `Valid nations to join are: ${nationNames}`);
    }
}
