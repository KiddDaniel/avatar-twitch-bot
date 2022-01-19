import { IPlayer } from "src/player.interface";
import { IInventoryItemSlot, IInventoryItem } from "../../inventory.interface";
import { IUpkeep } from "./upkeep";

export interface IMount extends IInventoryItem {}

export class Mount implements IInventoryItemSlot {
    name: string = "mount";
    items: Array<IMount> = [];

    static isMount(item: IInventoryItemSlot): item is Mount {
        return (item as Mount) !== undefined;
    }

    static getMount(p: IPlayer): Mount | null {
        const items: Array<string> = Object.keys(p.inventory.slots);
        let it: Mount | null = null;

        items.forEach((k: string) => {
            const slot: IInventoryItemSlot = p.inventory.slots[k];
            if (Mount.isMount(slot) && slot.name === "mount" && slot.items.length > 0) {
                it = slot as Mount;
            }
        });

        return it;
    }

    static checkSelfDestruct(p: IPlayer): string {
        const m: Mount | null = Mount.getMount(p);
        if (m === null) {
            return "";
        }

        const time: number = Date.now();
        // console.log(time, m.items[0].expire);
        if (time >= m.items[0].expire) {
            // remove this mount from player and notify him / her
            // do we have upkeeps left ?
            const upkeeps: Array<IUpkeep> = p.inventory.slots.upkeep.items;
            if (upkeeps.length > 0) {
                const u: IUpkeep | undefined = upkeeps.shift();
                if (u !== undefined) {
                    m.items[0].expire += u.expire * 1000;
                    const a: number = upkeeps.length;
                    return `Your mount has still ${a} upkeeps left .`;
                }
            }

            m.items.shift(); // remove the only mount
            return `Your mount has died due to insufficient funding.`;
        }
        return "";
    }
}
