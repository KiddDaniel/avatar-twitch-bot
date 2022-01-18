import { IMount } from "../slots/mount";

export class Dragon implements IMount {
    name = "dragon";
    expire = 604800;
    maxAmount = 1;
    nation = "fire";
    statRequired = { level: -1 };
    cost = 2000;
    statInfluence = {};
}
