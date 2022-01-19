import { IMount } from "../slots/mount";

export class FlyingBison implements IMount {
    name = "flyingbison";
    expire = 604800;
    maxAmount = 1;
    nation = "air";
    statRequired = { level: -1 };
    cost = 2000;
    statInfluence = {};
}
