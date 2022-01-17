import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class BadgerMole extends Mount {
    name: string = "badgermole";
    amount: number = -1;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "earth",
        statRequired: { level: -1 },
        cost: 2000,
        statInfluence: {},
    };
}
