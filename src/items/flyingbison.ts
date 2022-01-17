import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class FlyingBison extends Mount {
    name: string = "FlyingBison";
    amount: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "Air",
        statRequired: {},
        cost: 2000,
        statInfluence: {},
    };
}
