import { IPlayer } from "../player.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";

export class YipYipCommand implements IChatCommand {
    trigger = ["!yipyip"];
    cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // permittedUsers = ["avatarbot81"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const { data } = globals.storage;
        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot get your bonus because you are not registered as player!");
            }
            const time: number = Date.now();
            const player: IPlayer = data.players[user];
            if ("yipyip" in player.cooldown) {
                if (time - player.cooldown.yipyip <= this.cooldown) {
                    const remainder: number = this.cooldown - (time - player.cooldown.yipyip);
                    const hours: number = remainder / (60 * 60 * 1000);
                    return error(user, `Remaining yipyip cooldown time: ${hours.toFixed(2)} hours`);
                }
            }

            const yuan: number = 5;
            player.wallet += yuan;
            player.cooldown.yipyip = time;
            globals.storage.save();
            ret.messages.push(`Hey ${sender},you received your bonus of ${yuan} Yuan`);
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 or 1 additional parameters.");
        }

        return ret;
    }
}
