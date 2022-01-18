import { IUpkeep } from "../slots/upkeep";

export class BaseUpkeep implements IUpkeep {
    name = "upkeep";
    expire = 604800;
    maxAmount = 1;
    nation = "";
    statRequired = { level: -1 };
    cost = 20;
    statInfluence = {};
}
