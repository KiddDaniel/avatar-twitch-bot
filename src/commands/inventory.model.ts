import { IInventoryItem, IInventoryItemSlot } from "src/inventory.interface";
import { IPlayer } from "src/player.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";

export function printInventory(p: IPlayer) {
    let inventory: string = "";
    const slots: Array<IInventoryItemSlot> = Object.values(p.inventory.slots);
    slots.forEach((slot: IInventoryItemSlot) => {
        const { items } = slot;
        if (items.length > 0) {
            inventory = inventory.concat(`${slot.name} (${items.length}) : ( `);
            items.forEach((item: IInventoryItem) => {
                const str: string = `${item.name}; `;
                inventory = inventory.concat(str);
            });
            inventory = inventory.concat(") ");
        }
    });

    if (inventory === "") {
        inventory = "nothing";
    }

    return inventory;
}

export class InventoryCommand implements IChatCommand {
    trigger = ["!inventory"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const { data } = globals.storage;
        let inventory: string = "";

        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot view your inventory because you are not registered as player!");
            }
            const player: IPlayer = data.players[user];
            inventory = printInventory(player);
            const yuan: string = player.wallet.toString();
            ret.messages.push(`Hey @${user}, You have ${inventory} as inventory and ${yuan} in your wallet.`);
        } else if (recipients.length === 1) {
            const user: string = recipients[0];
            if (!(user in data.players)) {
                return error(
                    sender,
                    `You cannot view the inventory of user ${user} because he/she is not registered as player!`,
                );
            }
            const player: IPlayer = data.players[user];
            inventory = printInventory(player);
            const yuan: string = player.wallet.toString();
            ret.messages.push(`Hey @${sender}, user ${user} has ${inventory} as inventory and ${yuan} in wallet.`);
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 or 1 additional parameters.");
        }

        return ret;
    }
}
