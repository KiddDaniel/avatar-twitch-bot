import { IStockItem } from "src/inventory.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";

export class StockCommand implements IChatCommand {
    trigger = ["!stock", "!purchasable"];

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
        const s: string = sender;
        const { data } = globals.storage;

        if (!(s in data.players)) {
            return error(s, "You cannot view the stock inventory because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayStock(user);
        }

        return error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    async handleDisplayStock(user: string): Promise<IChatCommandResult> {
        let display: string = "";
        const { data } = globals.storage;
        const items: Array<IStockItem> = data.stock;
        items.forEach((it: IStockItem) => {
            const str: string = `${it.item.name}: ${it.item.cost} (${it.amount}); `;
            display = display.concat(str);
        });

        return {
            isSuccessful: true,
            messages: [`Hey @${user}, Today we have ${display} in stock.`],
        };
    }
}
