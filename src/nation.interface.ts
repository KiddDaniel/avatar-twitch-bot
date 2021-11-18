import { IPlayer } from "./player.interface";

export interface INation {
    readonly name: string;
    readonly members: Record<string, IPlayer>; // ?
}
