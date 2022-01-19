import { StockItem } from "../items/stockitem";
import { IDataSet, IStorage } from "../storage.interface";
import { Nation } from "./nation";

export class Storage implements IStorage {
    data: IDataSet;
    load(): Promise<void> {
        // not implemented here, but in base classes
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    save(): Promise<void> {
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    constructor(channel: string) {
        this.data = {
            channel,
            players: {},
            devs: ["scorpion8182", "paigfx", "mrdeathappears", "BothLine"],
            nations: [new Nation("water"), new Nation("fire"), new Nation("air"), new Nation("earth")],
            stock: [
                new StockItem("mount", "flyingbison"),
                new StockItem("mount", "badgermole"),
                new StockItem("mount", "dragon"),
                new StockItem("mount", "polarbeardog"),
                new StockItem("upkeep", "baseupkeep"),
                new StockItem("shoe", "baseshoe"),
                new StockItem("chest", "basechest"),
                new StockItem("hat", "basehat"),
                new StockItem("coat", "basecoat"),
                new StockItem("pants", "basepants"),
            ],
        };
    }

    // credit: Typescript documentation, src
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
    // function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    //    return o[propertyName]; // o[propertyName] is of type T[K]
    // }

    getProperty<K extends keyof IDataSet>(propertyName: K): IDataSet[K] {
        return this.data[propertyName];
    }

    setProperty<K extends keyof IDataSet>(propertyName: K, value: any): void {
        this.data[propertyName] = value;
    }
}
