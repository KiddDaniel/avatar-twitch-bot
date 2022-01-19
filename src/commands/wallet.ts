import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class WalletCommand implements IChatCommand {
    trigger = "!wallet";

    error(s: string, msg: string) {
        getTwitchClient().say(globals.channels[0], `Hey @${s}, ${msg}`);

        return {
            isSuccessful: false,
            error: msg,
        };
    }

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
        getTwitchClient().say(globals.channels[0], `Hey @${user}, You have ${wallet} Yuan in your wallet.`);

        return {
            isSuccessful: true,
        };
    }
}
