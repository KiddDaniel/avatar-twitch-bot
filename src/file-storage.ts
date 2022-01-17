import { BadgerMole } from "./items/badgermole";
import { Dragon } from "./items/dragon";
import { FlyingBison } from "./items/flyingbison";
import { PolarBearDog } from "./items/polarbeardog";
import { Upkeep } from "./items/upkeep";
import { IStorage } from "./storage.interface";

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
    stock = {
        itemTypes: ["upkeep", "dragon", "badgermole", "flyingbison", "polarbeardog"],
        items: {
            upkeep: new Upkeep(),
            dragon: new Dragon(),
            badgermole: new BadgerMole(),
            flyingbison: new FlyingBison(),
            polarbeardog: new PolarBearDog(),
        },
    };
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
