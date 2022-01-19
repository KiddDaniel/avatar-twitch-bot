import { INation } from "src/nation.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class LeaveCommand implements IChatCommand {
    trigger = "!leave";

    async execute(recipient: string | string[] | null, sender?: string): Promise<IChatCommandResult> {
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
        const { data } = globals.storage;

        if (data.devs.includes(s)) {
            let result: IChatCommandResult;
            if (normalizedRecipients.length === 1) {
                const user: string = normalizedRecipients[0];
                result = await this.handlePlayerUnregistration(user);
            } else {
                // testwise self deregistration, only for devs too.
                result = await this.handlePlayerUnregistration(s);
            }

            return result;
        }
        return { isSuccessful: false };
    }

    async handlePlayerUnregistration(player: string): Promise<IChatCommandResult> {
        // leave completely, so search in all nation members too.
        const { data } = globals.storage;
        const nations: INation[] = Object.values(data.nations);
        nations.forEach((x) => {
            if (x.members.includes(player)) {
                const index: number = x.members.indexOf(player);
                x.members.splice(index, 1);
            }
        });
        if (player in data.players) {
            delete data.players[player];
            await globals.storage.save();
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
