import { IInventory } from "./inventory.interface";
import { INation } from "./nation.interface";
import { IPlayer } from "./player.interface";

export interface IStorage {
    players: Record<string, IPlayer>;
    devs: string[];
    nations: Record<string, INation>;
    stock: IInventory; // this is everything the player can buy, what he has is in his own inventory

    load(): void;
    save(): void;
}
