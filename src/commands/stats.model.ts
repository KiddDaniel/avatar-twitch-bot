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
            const p: IPlayer = data.players[user];
            let stats: string = "";
            stats = stats.concat("Rank: ", p.rank, "; ");
            stats = stats.concat("Level: ", p.level.toString(), "; ");
            stats = stats.concat("XP: ", p.xp.toString(), "; ");
            stats = stats.concat("Up at: ", p.threshold.toString(), "; ");
            stats = stats.concat("Stats: ", printStats(p), "; ");

            ret.messages.push(`Hey ${sender}, your stats: ${stats}`);
            console.log(ret);
        } else if (recipients.length === 1) {
            const user: string = recipients[0];
            if (!(user in data.players)) {
                return error(
                    sender,
                    `You cannot view the stats of user ${user} because he/she is not registered as player!`,
                );
            }
            const p: IPlayer = data.players[user];
            let stats: string = "";
            stats = stats.concat("Rank: ", p.rank, "; ");
            stats = stats.concat("Level: ", p.level.toString(), "; ");
            stats = stats.concat("XP: ", p.xp.toString(), "; ");
            stats = stats.concat("Up at: ", p.threshold.toString(), "; ");
            stats = stats.concat("Stats: ", printStats(p), "; ");

            ret.messages.push(`Hey ${sender}, the stats of ${p.name}: ${stats}`);
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 or 1 additional parameters.");
        }

        return ret;
    }
}
