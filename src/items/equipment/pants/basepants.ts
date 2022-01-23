import { IPants } from "../../slots/pants";

export class BasePants implements IPants {
    name = "basepants";
    expire = -1;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 15;
    statInfluence = { toughness: 1 };
}
