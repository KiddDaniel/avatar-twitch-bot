import { IInventoryItemSlot, IInventoryItem } from "src/inventory.interface";

export interface IUpkeep extends IInventoryItem {}

export class Upkeep implements IInventoryItemSlot {
    items: Array<IUpkeep> = [];
    name: string = "upkeep";
}
