import { IPlayer } from "../player.interface";
import { globals } from "../twitch-client";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { printInventory } from "./inventory.model";
import { printStats } from "./stats.model";

export function printProfile(p: IPlayer): string {
    let data: string = "";
    data = data.concat("Nation ", p.nation, "; ");
    data = data.concat("Rank: ", p.rank, "; ");
    data = data.concat("Level: ", p.level.toString(), "; ");
    data = data.concat("XP: ", p.xp.toString(), "; ");
    data = data.concat("Up at: ", p.threshold.toString(), "; ");
    data = data.concat("Stats: ", printStats(p), " ");
    data = data.concat("Inv: ", printInventory(p), " ");
    data = data.concat("Yuan: ", p.wallet.toString(), ";");
    return data;
}

export class ProfileCommand implements IChatCommand {
    trigger = ["!profile"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const { data } = globals.storage;
        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot view your profile because you are not registered as player!");
            }
            const player: IPlayer = data.players[user];
            const profile: string = printProfile(player);

            ret.messages.push(`Hey ${sender}, your profile: ${profile}`);
        } else if (recipients.length === 1) {
            const user: string = recipients[0];
            if (!(user in data.players)) {
                return error(
                    sender,
                    `You cannot view the profile of user ${user} because he/she is not registered as player!`,
                );
            }
            const player: IPlayer = data.players[user];
            const profile: string = printProfile(player);

            ret.messages.push(`Hey ${sender}, the profile of ${player.name}: ${profile}`);
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 or 1 additional parameters.");
        }

        return ret;
    }
}
