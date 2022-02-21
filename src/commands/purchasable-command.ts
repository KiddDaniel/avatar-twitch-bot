import { availableItems } from "src/item";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class PurchasableCommand implements IChatCommand {
    trigger = ["!purchasable"];

    execute(): IChatCommandResult {
        PurchasableCommand.displayPurchasableItems();
        return { isSuccessful: true };
    }

    static displayPurchasableItems() {
        let allItemNames = "";

        Object.keys(availableItems).forEach((key) => { allItemNames += key + ", "; });
        getTwitchClient().say(globals.channels[0], `Purchasable Items: ${allItemNames}`);
        return { isSuccessful: true };
    }
}
