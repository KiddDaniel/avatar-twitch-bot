import { IInventoryItem, IInventoryItemProperty } from "src/inventory.interface";

export class Upkeep implements IInventoryItem {
    name: string = "upkeep";
    amount: number = -1;
    expire: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: -1,
        nation: "",
        statRequired: { level: -1 },
        cost: 20,
        statInfluence: {},
    };
}
