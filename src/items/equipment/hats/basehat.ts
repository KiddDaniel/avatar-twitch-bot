import { IHat } from "../../slots/hat";

export class BaseHat implements IHat {
    name = "basehat";
    expire = -1;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 8;
    statInfluence = { intelligence: 1 };
}
