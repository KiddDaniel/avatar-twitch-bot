import { IInventoryItem, IStockItem } from "src/inventory.interface";
import { ItemFactory } from "./factory";

export class StockItem implements IStockItem {
    amount: number = -1; // unlimited amount
    slot: string;
    item: IInventoryItem;

    constructor(slot: string, item: string) {
        this.slot = slot;
        const it: IInventoryItem | undefined = ItemFactory.create(item);
        if (it !== undefined) {
            this.item = it;
        }
    }
}
