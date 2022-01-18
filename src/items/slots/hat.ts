import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface IHat extends IInventoryItem {}

export class Hat implements IInventoryItemSlot {
    name: string = "hat";
    items: Array<IHat> = [];
}
