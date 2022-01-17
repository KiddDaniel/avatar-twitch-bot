import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class BadgerMole extends Mount {
    name: string = "BadgerMole";
    amount: number = 0;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "Earth",
        statRequired: {},
        cost: 2000,
        statInfluence: {},
    };
}
