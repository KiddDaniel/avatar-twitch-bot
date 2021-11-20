import { INation } from "./nation.interface";
import { IPlayer } from "./player.interface";

export interface IStorage {
    players: Record<string, IPlayer>;
    devs: string[];
    nations: Record<string, INation>;

    load(): void;
    save(): void;
}
