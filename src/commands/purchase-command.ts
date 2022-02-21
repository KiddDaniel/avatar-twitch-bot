import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { PurchasableCommand } from "./purchasable-command";

export class PurchaseCommand implements IChatCommand {
    trigger = ["!purchase"];

    execute(params: string | string[] | null, sender?: string): IChatCommandResult {
        if (!params || params.length <= 0) {
            PurchasableCommand.displayPurchasableItems();
        }

        if (!sender) {

        }
       
        return { isSuccessful: true };
    }
}
