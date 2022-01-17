import { IInventoryItem, IInventoryItemProperty } from "src/inventory.interface";

export class Upkeep implements IInventoryItem {
    name: string = "Upkeep";
    amount: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: -1,
        nation: "",
        statRequired: {},
        cost: 20,
        statInfluence: {},
    };
}
