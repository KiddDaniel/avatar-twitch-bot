import { IStats } from "../stats.interface";
import { adaptStats, IPlayer } from "../player.interface";
import { globals } from "../twitch-client";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";

export function printStats(p: IPlayer): string {
    let stats: string = "";
    const adapt: IStats = adaptStats(p);
    let keys: string[] = Object.keys(p.stats.base);

    keys.forEach((stat: string) => {
        stats = stats.concat(stat, ": ", adapt.base[stat].toFixed(2).toString(), "; ");
    });
    stats = stats.concat(" --- ");

    keys = Object.keys(p.stats.calc);
    keys.forEach((stat: string) => {
        stats = stats.concat(stat, ": ", adapt.calc[stat].toFixed(2).toString(), "; ");
    });

    return stats;
}

export class StatsCommand implements IChatCommand {
    trigger = ["!stats"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const { data } = globals.storage;
        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot view your stats because you are not registered as player!");
            }
            const player: IPlayer = data.players[user];
            const profile: string = printStats(player);

            ret.messages.push(`Hey ${sender}, your stats: ${profile}`);
            console.log(ret);
        } else if (recipients.length === 1) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(
                    user,
                    `You cannot view the stats of user ${user} because he/she is not registered as player!`,
                );
            }
            const player: IPlayer = data.players[user];
            const profile: string = printStats(player);

            ret.messages.push(`Hey ${sender}, the stats of ${player.name}: ${profile}`);
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 or 1 additional parameters.");
        }

        return ret;
    }
}
