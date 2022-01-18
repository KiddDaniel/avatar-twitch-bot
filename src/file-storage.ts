import { BadgerMole } from "./items/mounts/badgermole";
import { Dragon } from "./items/mounts/dragon";
import { FlyingBison } from "./items/mounts/flyingbison";
import { PolarBearDog } from "./items/mounts/polarbeardog";
import { IStorage } from "./storage.interface";
import { BaseUpkeep } from "./items/misc/baseupkeep";
import { BaseShoe } from "./items/equipment/shoes/baseshoe";
import { BaseChest } from "./items/equipment/chests/basechest";
import { BaseCoat } from "./items/equipment/coats/basecoat";
import { BaseHat } from "./items/equipment/hats/basehat";
import { BasePants } from "./items/equipment/pants/basepants";

const jsonfile = require("jsonfile");

// ToDo persistent storage of the players / devs record. ideally in JSON format. File ? small database ?
export class FileStorage implements IStorage {
    load(): void {
        jsonfile.readFile(this.filename, (err: any, data: any) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                const keys: string[] = Object.keys(data);
                keys.forEach((k) => {
                    this.setProperty(k as keyof IStorage, data[k]);
                });
                console.log(`File is read successfully!`);
            }
        });
    }
    save(): void {
        jsonfile.writeFile(this.filename, this, { spaces: 4 }, (err: any) => {
            if (err) {
                console.log(`Error writing file to disk: ${err}`);
            } else {
                console.log(`File is written successfully!`);
            }
        });
    }

    players = {};
    devs = [];
    nations = {};
    stock = [
        {
            amount: -1,
            slot: "mount",
            item: new FlyingBison(),
        },
        {
            amount: -1,
            slot: "mount",
            item: new BadgerMole(),
        },
        {
            amount: -1,
            slot: "mount",
            item: new Dragon(),
        },
        {
            amount: -1,
            slot: "mount",
            item: new PolarBearDog(),
        },
        {
            amount: -1,
            slot: "upkeep",
            item: new BaseUpkeep(),
        },
        {
            amount: -1,
            slot: "shoe",
            item: new BaseShoe(),
        },
        {
            amount: -1,
            slot: "coat",
            item: new BaseCoat(),
        },
        {
            amount: -1,
            slot: "hat",
            item: new BaseHat(),
        },
        {
            amount: -1,
            slot: "chest",
            item: new BaseChest(),
        },
        {
            amount: -1,
            slot: "pants",
            item: new BasePants(),
        },
    ];
    filename = "./src/data.json";

    // credit: Typescript documentation, src
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
    // function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    //    return o[propertyName]; // o[propertyName] is of type T[K]
    // }

    getProperty<K extends keyof IStorage>(propertyName: K): IStorage[K] {
        return this[propertyName];
    }

    setProperty<K extends keyof IStorage>(propertyName: K, value: any): void {
        this[propertyName] = value;
    }
}
