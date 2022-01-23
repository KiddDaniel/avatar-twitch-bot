import { INation } from "src/nation.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";

export class LeaveCommand implements IChatCommand {
    trigger = ["!leave"];

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
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
        return error(s, "You cannot leave the game on your own, ask a dev to unregister you!");
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
            return {
                isSuccessful: true,
                messages: [`Hey @${player}, you have been unregistered from your nation and as player.`],
            };
        }

        return error(player, "you are not registered as player, so you cannot unregister.");
    }
}
