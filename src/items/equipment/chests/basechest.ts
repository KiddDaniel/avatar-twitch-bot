import { IChest } from "../../slots/chest";

export class BaseChest implements IChest {
    name = "basechest";
    expire = -1;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 20;
    statInfluence = { hp: 1 };
}
