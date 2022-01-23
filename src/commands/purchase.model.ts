import { IInventoryItem, IStockItem } from "../inventory.interface";
import { Mount } from "../items/slots/mount";
import { IPlayer } from "../player.interface";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { ItemFactory } from "../items/factory";

export class PurchaseCommand implements IChatCommand {
    trigger = ["!purchase"];

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
        const s: string = sender;
        const { data } = globals.storage;

        if (!(s in data.players)) {
            return error(s, "You cannot purchase anything because you are not registered as player!");
        }

        // purchase itemname -> mount upkeep shoe, etc.... check against "valid" itemnames from storage -> stock
        // if valid(item) and player.wallet > cost -> purchase
        // expiration timer for mount upkeeps reset or add
        // when will the bot trigger the death of the mount...  does it manage timers in the background,
        // or on "next access" of the mount ?
        if (normalizedRecipients.length === 1) {
            const user: string = s;
            const item: string = normalizedRecipients[0];
            const result: IChatCommandResult = await this.handleItemPurchase(user, item);
            return result;
        }

        return error(s, "Please specify which item you wish to purchase !");
    }

    async handleItemPurchase(user: string, item: string): Promise<IChatCommandResult> {
        // check items validity
        const { data } = globals.storage;
        const items: Array<IStockItem> = data.stock;
        let piece: IStockItem | undefined;
        items.forEach((it: IStockItem) => {
            if (item === it.item.name) {
                piece = it;
            }
        });

        if (!piece) {
            return error(user, `Item ${item} does not exist in stock!`);
        }

        if (piece.amount === 0) {
            return error(user, "This item is currently not available in stock!");
        }

        // check price aka cost in stock
        const player: IPlayer = data.players[user];
        const price: number = piece.item.cost;
        const balance: number = player.wallet;
        const max: number = piece.item.maxAmount;
        const playerAmount: number = player.inventory.slots[piece.slot].items.length;
        const { level } = piece.item.statRequired;
        const playerLevel: number = player.level;
        const { nation } = piece.item;
        const playerNation: string = player.nation;

        const enoughMoney: boolean = balance > price;
        const enoughSpace: boolean = playerAmount < max || max === -1;
        const enoughLevel: boolean = playerLevel >= level || level === -1;
        const correctNation: boolean = playerNation === nation || nation === "";
        const upkeepNoMount: boolean = piece.slot === "upkeep" && !Mount.getMount(player);

        if (!correctNation) {
            return error(user, "This item is not available for your nation !");
        }

        if (!enoughMoney) {
            return error(user, "You do not have enough Yuan to purchase this item !");
        }

        if (!enoughSpace) {
            return error(user, "You already own the maximum amount of this item type !");
        }

        if (!enoughLevel) {
            return error(
                user,
                `Your level of experience ( have: ${playerLevel}, 
                need: ${level} ) is too low to purchase this item !`,
            );
        }

        if (upkeepNoMount) {
            return error(user, "You cannot purchase a mount upkeep without having a mount in your inventory !");
        }

        // successful purchase
        data.players[user].wallet -= price;
        // if the stock has a limit, decrease it, -1 for unlimited
        if (piece.amount > -1) {
            piece.amount -= 1;
        }
        // increase players amount (need to create an instance here)
        const nitem: IInventoryItem | undefined = ItemFactory.create(piece.item.name);
        if (nitem !== undefined) {
            // what to do with expiration, for example death timers... the bot process manages that per user ? really ?
            const { expire } = piece.item;
            // -1 for never expire
            if (expire > -1) {
                if (piece.slot === "mount") {
                    const time: number = Date.now();
                    nitem.expire = time + expire * 1000; // time is in milliseconds
                }
            }
            // do NOT alter base or calculated stats here already, keep unmodified values
            // only calculate freshly for stats display and combat calculations
            data.players[user].inventory.slots[piece.slot].items.push(nitem);

            await globals.storage.save();
            return {
                isSuccessful: true,
                messages: [`Hey @${user}, You successfully purchased an item of the type ${item}`],
            };
        }

        return error(user, "Attempted to purchase an unknown item, canceled the purchase");
    }
}
