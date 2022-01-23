import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface ICoat extends IInventoryItem {}

export class Coat implements IInventoryItemSlot {
    name: string = "coat";
    items: Array<ICoat> = [];
}
