import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface IChest extends IInventoryItem {}

export class Chest implements IInventoryItemSlot {
    items: Array<IChest> = [];
    name: string = "chest";
}
