import { IDataSet } from "src/storage.interface";
import { Storage } from "./storage";

const jsonfile = require("jsonfile");

// ToDo persistent storage of the players / devs record. ideally in JSON format. File ? small database ?
export class FileStorage extends Storage {
    load(): Promise<void> {
        return new Promise<void>((resolve) => {
            jsonfile.readFile(this.filename, (err: any, data: any) => {
                if (err) {
                    console.log(`Error reading file from disk: ${err}`);
                    // create empty file with filename
                    jsonfile.writeFile(this.filename, {}, { spaces: 4 }, (error: any) => {
                        if (!error) {
                            console.log("File was initialized");
                        }
                    });
                    resolve();
                } else {
                    const keys: string[] = Object.keys(data);
                    keys.forEach((k) => {
                        this.setProperty(k as keyof IDataSet, data[k]);
                    });
                    console.log(`File is read successfully!`);
                    resolve();
                }
            });
        });
    }
    save(): Promise<void> {
        return new Promise<void>((resolve) => {
            jsonfile.writeFile(this.filename, this.data, { spaces: 4 }, (err: any) => {
                if (err) {
                    console.log(`Error writing file to disk: ${err}`);
                    resolve();
                } else {
                    console.log(`File is written successfully!`);
                    resolve();
                }
            });
        });
    }

    filename = `./data/${this.data.channel}_data.json`;
}
