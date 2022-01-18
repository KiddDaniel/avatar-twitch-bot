import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface IShoe extends IInventoryItem {}

export class Shoe implements IInventoryItemSlot {
    name: string = "shoe";
    items: Array<IShoe> = [];
}
