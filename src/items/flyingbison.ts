import { IInventoryItemProperty } from "src/inventory.interface";
import { Mount } from "./mount";

export class FlyingBison extends Mount {
    name: string = "flyingbison";
    amount: number = -1;
    properties: IInventoryItemProperty = {
        expire: 604800,
        maxAmount: 1,
        nation: "air",
        statRequired: { level: -1 },
        cost: 2000,
        statInfluence: {},
    };
}
