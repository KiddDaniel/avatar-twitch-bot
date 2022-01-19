import { IMount } from "../slots/mount";

export class BadgerMole implements IMount {
    name = "badgermole";
    expire = 604800;
    maxAmount = 1;
    nation = "earth";
    statRequired = { level: -1 };
    cost = 2000;
    statInfluence = {};
}
