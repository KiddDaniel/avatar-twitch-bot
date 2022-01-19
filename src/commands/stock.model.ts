import { IStockItem } from "src/inventory.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class StockCommand implements IChatCommand {
    trigger = "!stock";

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
            return this.error(s, "You cannot view the stock inventory because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayStock(user);
        }

        return this.error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    async handleDisplayStock(user: string): Promise<IChatCommandResult> {
        let display: string = "";
        const { data } = globals.storage;
        const items: Array<IStockItem> = data.stock;
        items.forEach((it: IStockItem) => {
            const str: string = `${it.item.name}: ${it.item.cost} (${it.amount}); `;
            display = display.concat(str);
        });
        getTwitchClient().say(globals.channels[0], `Hey @${user}, Today we have ${display} in stock.`);

        return {
            isSuccessful: true,
        };
    }
}
