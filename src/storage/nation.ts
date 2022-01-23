import { IFighter, INation } from "../nation.interface";

export class Nation implements INation {
    name: string;
    members: string[] = [];
    wallet: number = 0;
    pveQueue: string[] = [];
    playerSlot: IFighter;
    npcSlot: IFighter;
    nvnQueue: {
        open: boolean;
        queue: IFighter[];
        closeTimer: number;
    };

    constructor(name: string) {
        this.name = name;
        this.nvnQueue.closeTimer = 5 * 60 * 1000; // 5 minutes
    }
}
