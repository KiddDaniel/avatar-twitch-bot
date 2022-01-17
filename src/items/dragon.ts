import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class Dragon extends Mount {
    name: string = "Dragon";
    amount: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "Fire",
        statRequired: {},
        cost: 2000,
        statInfluence: {},
    };
}
