import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { CommandBase } from "./base.model";

export class WalletCommand extends CommandBase implements IChatCommand {
    trigger = "!wallet";

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
        const s: string = sender;
        const { data } = globals.storage;

        if (!(s in data.players)) {
            return this.error(s, "You cannot view your wallet because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayWallet(user);
        }

        return this.error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    async handleDisplayWallet(user: string): Promise<IChatCommandResult> {
        const { data } = globals.storage;
        const { wallet } = data.players[user];

        return {
            isSuccessful: true,
            messages: [`Hey @${user}, You have ${wallet} Yuan in your wallet.`],
        };
    }
}
