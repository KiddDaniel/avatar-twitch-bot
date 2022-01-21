import { ICoat } from "../../slots/coat";

export class BaseCoat implements ICoat {
    name = "basecoat";
    expire = -1;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 10;
    statInfluence = { charisma: 1 };
}
