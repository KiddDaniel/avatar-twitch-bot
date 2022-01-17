import { IInventoryItem } from "../inventory.interface";
import { Mount } from "../items/mount";
import { IPlayer } from "../player.interface";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class PurchaseCommand implements IChatCommand {
    trigger = "!purchase";

    error(s: string, msg: string) {
        getTwitchClient().say(globals.channels[0], `Hey @${s}, ${msg}`);

        return {
            isSuccessful: false,
            error: msg,
        };
    }

    execute(recipient: string | string[] | null, sender?: string): IChatCommandResult {
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

        if (!(s in globals.storage.players)) {
            return this.error(s, "You cannot purchase anything because you are not registered as player!");
        }

        // purchase itemname -> mount upkeep shoe, etc.... check against "valid" itemnames from storage -> stock
        // if valid(item) and player.wallet > cost -> purchase
        // expiration timer for mount upkeeps reset or add
        // when will the bot trigger the death of the mount...  does it manage timers in the background,
        // or on "next access" of the mount ?
        if (normalizedRecipients.length === 1) {
            const user: string = s;
            const item: string = normalizedRecipients[0];
            return this.handleItemPurchase(user, item);
        }

        return this.error(s, "Please specify which item you wish to purchase !");
    }

    handleItemPurchase(user: string, item: string): IChatCommandResult {
        // check items validity
        const itemExisting: boolean = item in globals.storage.stock.slots;
        if (!itemExisting) {
            return this.error(user, `Item ${item} does not exist in stock!`);
        }

        const itemAmount: number = globals.storage.stock.slots[item].amount;

        if (itemAmount === 0) {
            return this.error(user, "This item is currently not available in stock!");
        }

        // check price aka cost in stock
        const piece: IInventoryItem = globals.storage.stock.slots[item];
        const player: IPlayer = globals.storage.players[user];
        const price: number = piece.properties.cost;
        const balance: number = globals.storage.players[user].wallet;
        const max: number = piece.properties.maxAmount;
        const playerAmount: number = player.inventory.slots[item].amount;
        const { level } = piece.properties.statRequired;
        const playerLevel: number = player.stats.base.level;
        const { nation } = piece.properties;
        const playerNation: string = player.nation;

        const enoughMoney: boolean = balance > price;
        const enoughSpace: boolean = playerAmount < max || max === -1;
        const enoughLevel: boolean = playerLevel >= level || level === -1;
        const correctNation: boolean = playerNation === nation || nation === "";
        const upkeepNoMount: boolean = piece.name === "upkeep" && !Mount.getMount(player);

        if (!correctNation) {
            return this.error(user, "This item is not available for your nation !");
        }

        if (!enoughMoney) {
            return this.error(user, "You do not have enough Yuan to purchase this item !");
        }

        if (!enoughSpace) {
            return this.error(user, "You already own the maximum amount of this item type !");
        }

        if (!enoughLevel) {
            return this.error(
                user,
                `Your level of experience ( have: ${playerLevel}, 
                need: ${level} ) is too low to purchase this item !`,
            );
        }

        if (upkeepNoMount) {
            return this.error(user, "You cannot purchase a mount upkeep without having a mount in your inventory !");
        }

        // successful purchase
        globals.storage.players[user].wallet -= price;
        // if the stock has a limit, decrease it, -1 for unlimited
        if (piece.amount > -1) {
            globals.storage.stock.slots[item].amount -= 1;
        }
        // increase players amount
        globals.storage.players[user].inventory.slots[item].amount += 1;

        // what to do with expiration, for example death timers... the bot process manages that per user ? really ?
        const { expire } = globals.storage.stock.slots[item].properties;
        // -1 for never expire
        if (expire > -1) {
            const time: number = Date.now() / 1000; // in seconds
            globals.storage.players[user].inventory.slots[item].expire = time + expire;
        }

        globals.storage.save();
        getTwitchClient().say(
            globals.channels[0],
            `Hey @${user}, You successfully purchased an item of the type ${item}`,
        );

        return {
            isSuccessful: true,
        };
    }
}
