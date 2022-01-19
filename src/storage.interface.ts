import { IStockItem } from "./inventory.interface";
import { INation } from "./nation.interface";
import { IPlayer } from "./player.interface";

export interface IStorage {
    players: Record<string, IPlayer>;
    devs: Array<string>;
    nations: Array<INation>;
    stock: Array<IStockItem>; // this is everything the player can buy, what he has is in his own inventory

    load(): void;
    save(): void;
}
