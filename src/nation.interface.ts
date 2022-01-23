export interface IBattleQueue {
    open: boolean;
    queue: IFighter[];
    closeTimer: number;
}

export interface IFighter {
    name: string;
    nation: string;
    level: number;
    stats: Record<string, number>;
}
export interface INation {
    readonly name: string;
    readonly members: string[]; // only player names
    pveQueue: IBattleQueue;
    playerSlot: IFighter;
    npcSlot: IFighter;
    nvnQueue: IBattleQueue;
    wallet: number;
}
