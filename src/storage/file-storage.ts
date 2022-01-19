import { Storage } from "./storage";

const jsonfile = require("jsonfile");

// ToDo persistent storage of the players / devs record. ideally in JSON format. File ? small database ?
export class FileStorage extends Storage {
    load(): void {
        jsonfile.readFile(this.filename, (err: any, data: any) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                const keys: string[] = Object.keys(data);
                keys.forEach((k) => {
                    this.setProperty(k as keyof Storage, data[k]);
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

    filename = "./src/data.json";

    // credit: Typescript documentation, src
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
    // function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    //    return o[propertyName]; // o[propertyName] is of type T[K]
    // }

    getProperty<K extends keyof Storage>(propertyName: K): Storage[K] {
        return this[propertyName];
    }

    setProperty<K extends keyof Storage>(propertyName: K, value: any): void {
        this[propertyName] = value;
    }
}
