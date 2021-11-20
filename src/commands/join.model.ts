import { IPlayer } from "src/player.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

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
        if (globals.devs.includes(s)) {
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
        if (!(user in globals.players)) {
            const player: IPlayer = { isRegistered: true, isDeveloper: sender in globals.devs, name: user };

            // do nation check, what to do when already associated ?
            if (nation in globals.nations) {
                if (!(user in globals.nations[nation].members)) {
                    globals.nations[nation].members[user] = player;
                    globals.players[user] = player;
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

            const nations: string[] = Object.keys(globals.nations);
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
        getTwitchClient().say(
            globals.channels[0],
            `Hey @${sender}, 
             you can register in the nation of ${nation} under ${url}`,
        );
        return { isSuccessful: true };
    }
}
