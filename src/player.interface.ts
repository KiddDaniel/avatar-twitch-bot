import { IInventory, IInventoryItem } from "./inventory.interface";
import { calculate, IStats } from "./stats.interface";

export enum Rank {
    newbie = "Neuling",
    beginner = "Anfänger",
    novice = "Kompetenter",
    proficient = "Gewandter",
    bender = "Bändiger",
}

export function adaptStats(p: IPlayer): IStats {
    // adapt stats (do this also in exp function, or move it there)
    let keys: Array<string> = Object.keys(p.inventory.slots);
    const items: IInventoryItem[] = [];
    const ret: IStats = {
        base: {},
        calc: {},
    };

    keys.forEach((slot: string) => {
        p.inventory.slots[slot].items.forEach((it: IInventoryItem) => {
            items.push(it);
        });
    });

    // initialize copy
    keys = Object.keys(p.stats.calc);
    keys.forEach((k: string) => {
        ret.calc[k] = p.stats.calc[k];
    });

    keys = Object.keys(p.stats.base);
    keys.forEach((k: string) => {
        ret.base[k] = p.stats.base[k];
    });

    // modify copy
    items.forEach((i: IInventoryItem) => {
        keys.forEach((k: string) => {
            if (k in p.stats.base) {
                if (k in i.statInfluence) {
                    ret.base[k] += i.statInfluence[k];
                }
            }
        });
    });
    // trigger intermediate recalculation of changed base stats
    calculate(ret);

    keys = Object.keys(p.stats.calc);
    items.forEach((i: IInventoryItem) => {
        keys.forEach((k: string) => {
            if (k in p.stats.calc) {
                if (k in i.statInfluence) {
                    ret.calc[k] += i.statInfluence[k];
                }
            }
        });
    });

    return ret;
}

export function exp(p: IPlayer, xp: number) {
    p.xp += xp;
    p.threshold = p.level * (p.level - 1) * 50; // ToDo: level 1, threshold 0 ? that correct ?
    if (p.xp >= p.threshold) {
        p.level += 1;
        // p.xp = 0;
    }

    if (p.level >= 13) {
        p.rank = Rank.bender;
    } else if (p.level >= 10) {
        p.rank = Rank.proficient;
    } else if (p.level >= 7) {
        p.rank = Rank.novice;
    } else if (p.level >= 4) {
        p.rank = Rank.beginner;
    } else if (p.level >= 0) {
        p.rank = Rank.newbie;
    }
}
export interface IPlayer {
    readonly isDeveloper: boolean;
    readonly isRegistered: boolean;
    readonly name: string;
    nation: string; // need to set this when joining
    stats: IStats; // set to 1 when joining, is this a stat ?
    inventory: IInventory;
    xp: number;
    threshold: number;
    level: number;
    rank: string;
    wallet: number; // players money is here
    cooldown: Record<string, number>; // store personal cooldowns here
}
