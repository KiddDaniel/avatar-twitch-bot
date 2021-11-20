import { INation } from "src/nation.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class LeaveCommand implements IChatCommand {
    trigger = "!leave";

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

        if (globals.storage.devs.includes(s)) {
            if (normalizedRecipients.length === 1) {
                const user: string = normalizedRecipients[0];
                return this.handlePlayerUnregistration(user);
            }
        }

        return this.handlePlayerUnregistration(s);
    }

    handlePlayerUnregistration(player: string): IChatCommandResult {
        // leave completely, so search in all nation members too.
        const nations: INation[] = Object.values(globals.storage.nations);
        nations.forEach((x) => {
            if (player in x.members) {
                delete x.members[player];
            }
        });
        if (player in globals.storage.players) {
            delete globals.storage.players[player];
            globals.storage.save();
            getTwitchClient().say(
                globals.channels[0],
                `Hey @${player}, you have been unregistered from your nation and as player.`,
            );

            return {
                isSuccessful: true,
            };
        }

        getTwitchClient().say(
            globals.channels[0],
            `Hey @${player}, you are not registered as player, so you cannot unregister.`,
        );

        return {
            isSuccessful: false,
            error: "player was not registered",
        };
    }
}
