import { IShoe } from "../../slots/shoe";

export class BaseShoe implements IShoe {
    name = "baseshoe";
    expire = -1;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 10;
    statInfluence = { dexterity: 1 };
}
