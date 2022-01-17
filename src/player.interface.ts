import { IInventory } from "./inventory.interface";
import { IStats } from "./stats.interface";

export interface IPlayer {
    readonly isDeveloper: boolean;
    readonly isRegistered: boolean;
    readonly name: string;
    nation: string; // need to set this when joining
    stats: IStats; // set to 1 when joining, is this a stat ?
    inventory: IInventory;
    wallet: number; // players money is here
}
