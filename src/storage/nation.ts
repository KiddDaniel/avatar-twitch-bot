import { INation } from "src/nation.interface";
import { IPlayer } from "src/player.interface";

export class Nation implements INation {
    name: string;
    members: string[] = [];
    wallet: number = 0;
    pveQueue: string[] = [];
    playerSlot: IPlayer;
    npcSlot: Record<string, number> = {};
    nvnQueue: string[] = [];

    constructor(name: string) {
        this.name = name;
    }
}
