import { IPlayer } from "src/player.interface";
import { IInventoryItem, IInventoryItemProperty } from "../inventory.interface";

export class Mount implements IInventoryItem {
    name: string;
    amount: number;
    expire: number;
    properties: IInventoryItemProperty;

    static isMount(item: IInventoryItem): item is Mount {
        return (item as Mount) !== undefined;
    }

    static getMount(p: IPlayer): Mount | null {
        const items: Array<string> = Object.keys(p.inventory.items);

        items.forEach((k: string) => {
            const item: IInventoryItem = p.inventory.items[k];
            if (Mount.isMount(item)) {
                return item as Mount;
            }

            return null;
        });

        return null;
    }

    static checkSelfDestruct(p: IPlayer): string {
        const m: Mount | null = Mount.getMount(p);
        if (m === null) {
            return "";
        }

        const time: number = Date.now() / 1000; // time in seconds
        if (time >= m.expire) {
            // remove this mount from player and notify him / her
            // do we have upkeeps left ?
            if (p.inventory.items.Upkeep.amount > 0) {
                p.inventory.items.Upkeep.amount -= 1;
                m.expire += p.inventory.items.Upkeep.properties.expire;
                const a: number = p.inventory.items.Upkeep.amount;
                return `Hey @${p.name}, your mount has still ${a} upkeeps left .`;
            }

            p.inventory.items[m.name].amount = 0;
            p.inventory.items[m.name].expire = -1;
            return `Hey @${p.name}, your mount has died due to insufficient funding.`;
        }
        return "";
    }
}
