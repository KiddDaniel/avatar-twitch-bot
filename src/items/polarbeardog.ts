import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class PolarBearDog extends Mount {
    name: string = "PolarBearDog";
    amount: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "Water",
        statRequired: {},
        cost: 2000,
        statInfluence: {},
    };
}
