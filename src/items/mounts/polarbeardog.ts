import { IMount } from "../slots/mount";

export class PolarBearDog implements IMount {
    name = "polarbeardog";
    expire = 604800;
    maxAmount = 1;
    nation = "water";
    statRequired = { level: -1 };
    cost = 2000;
    statInfluence = {};
}
