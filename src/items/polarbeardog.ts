import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class PolarBearDog extends Mount {
    name: string = "polarbeardog";
    amount: number = -1;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "water",
        statRequired: { level: -1 },
        cost: 2000,
        statInfluence: {},
    };
}
