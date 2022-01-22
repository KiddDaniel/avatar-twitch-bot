import { IPlayer } from "./player.interface";

export interface INation {
    readonly name: string;
    readonly members: string[]; // only player names
    pveQueue: string[];
    playerSlot: IPlayer;
    npcSlot: Record<string, number>;
    nvnQueue: string[];
    wallet: number;
}
