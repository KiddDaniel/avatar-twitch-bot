import { IStockItem } from "src/inventory.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { CommandBase } from "./base.model";

export class StockCommand extends CommandBase implements IChatCommand {
    trigger = "!stock";

    async execute(recipient: string | string[] | null, sender?: string): Promise<IChatCommandResult> {
        if (sender === undefined) return this.error(sender, "No sender available.");

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

        return {
            isSuccessful: true,
            messages: [`Hey @${user}, Today we have ${display} in stock.`],
        };
    }
}
