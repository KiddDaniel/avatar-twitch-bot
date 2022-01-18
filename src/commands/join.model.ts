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

export class JoinCommand implements IChatCommand {
    trigger = "!join";

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

            getTwitchClient().say(
                globals.channels[0],
                `Hey @${s}, 
                 please specify nation to register or user and nation as dev to register another new player`,
            );

            return {
                isSuccessful: false,
                error: "please specify nation and player as dev to register another new player",
            };
        }
        if (normalizedRecipients.length === 1) {
            const nation: string = normalizedRecipients[0];
            return this.showRegistrationInfo(s, nation);
        }

        getTwitchClient().say(
            globals.channels[0],
            `Hey @${s}, 
             please specify nation as user to apply for registration into a nation by a dev`,
        );

        return {
            isSuccessful: false,
            error: "please specify nation as user to apply for registration into a nation by a dev",
        };
    }

    handlePlayerRegistration(sender: string, user: string, nation: string): IChatCommandResult {
        if (!(user in globals.storage.players)) {
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
            if (nation in globals.storage.nations) {
                if (!globals.storage.nations[nation].members.includes(user)) {
                    globals.storage.nations[nation].members.push(user);
                    globals.storage.players[user] = player;
                    globals.storage.save();
                    getTwitchClient().say(
                        globals.channels[0],
                        `Hey @${user}, 
                        you are now registered in the nation of ${nation}`,
                    );
                } else {
                    getTwitchClient().say(
                        globals.channels[0],
                        `Hey @${user}, 
                        you are already registered in the nation of ${nation}`,
                    );
                }
                return { isSuccessful: true };
            }

            const nations: string[] = Object.keys(globals.storage.nations);
            getTwitchClient().say(
                globals.channels[0],
                `Hey @${user}, 
                 valid nations to join are: ${nations}`,
            );

            return { isSuccessful: false, error: "Invalid nation." };
        }

        getTwitchClient().say(
            globals.channels[0],
            `Hey @${user}, 
             you are already registered as player.`,
        );
        return { isSuccessful: false, error: "Player is already registered." };
    }

    showRegistrationInfo(sender: string, nation: string): IChatCommandResult {
        const url: string = "https://avatar-twitch-bot.com/register";
        if (nation in globals.storage.nations) {
            getTwitchClient().say(
                globals.channels[0],
                `Hey @${sender}, 
                you can register in the nation of ${nation} under ${url}`,
            );
            return { isSuccessful: true };
        }

        const nations: string[] = Object.keys(globals.storage.nations);
        getTwitchClient().say(
            globals.channels[0],
            `Hey @${sender}, 
             valid nations to join are: ${nations}`,
        );

        return { isSuccessful: false, error: "Invalid nation." };
    }
}
