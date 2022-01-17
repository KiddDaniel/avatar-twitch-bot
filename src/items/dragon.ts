import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class Dragon extends Mount {
    name: string = "dragon";
    amount: number = -1;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "fire",
        statRequired: { level: -1 },
        cost: 2000,
        statInfluence: {},
    };
}
