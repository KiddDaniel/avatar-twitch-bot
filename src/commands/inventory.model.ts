import { IInventoryItem, IInventoryItemSlot } from "src/inventory.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { CommandBase } from "./base.model";

export class InventoryCommand extends CommandBase implements IChatCommand {
    trigger = "!inventory";

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
            return this.error(s, "You cannot view your inventory because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayInventory(user);
        }

        return this.error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    handleDisplayInventory(user: string): IChatCommandResult {
        const { data } = globals.storage;
        let display: string = "";
        const slots: Array<IInventoryItemSlot> = Object.values(data.players[user].inventory.slots);
        slots.forEach((slot: IInventoryItemSlot) => {
            const { items } = slot;
            if (items.length > 0) {
                display = display.concat(`${slot.name} (${items.length}) : ( `);
                items.forEach((item: IInventoryItem) => {
                    const str: string = `${item.name}; `;
                    display = display.concat(str);
                });
                display = display.concat(") ");
            }
        });

        if (display === "") {
            display = "nothing";
        }

        return {
            isSuccessful: true,
            messages: [`Hey @${user}, You have ${display} in your inventory.`],
        };
    }
}
