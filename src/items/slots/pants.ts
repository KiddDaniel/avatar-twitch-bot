import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface IPants extends IInventoryItem {}

export class Pants implements IInventoryItemSlot {
    name: string = "pants";
    items: Array<IPants> = [];
}
