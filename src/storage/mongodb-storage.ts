import * as mongodb from "mongodb";
import { IDataSet } from "src/storage.interface";
import { Storage } from "./storage";

export class MongoDBStorage extends Storage {
    url = "mongodb://localhost:27017/avatarbot";
    mongo = new mongodb.MongoClient(this.url);
    collectionName = "channels"; // the channels the bot runs on

    load(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.mongo.connect().then((m: mongodb.MongoClient) => {
                const coll: mongodb.Collection = m.db().collection(this.collectionName);
                const query = { channel: this.data.channel };
                coll.findOne(query).then((d) => {
                    console.log("Loaded the document");
                    if (d === null) {
                        // create on the fly if missing
                        coll.insertOne(this.data).then((r) => {
                            console.log("Inserted the document", r);
                            resolve();
                        });
                    } else {
                        // console.log(d);
                        const keys: string[] = Object.keys(d);
                        keys.forEach((k) => {
                            this.setProperty(k as keyof IDataSet, d[k]);
                        });
                        resolve();
                    }
                });
            });
        });
    }

    save(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.mongo.connect().then((m: mongodb.MongoClient) => {
                const coll: mongodb.Collection = m.db().collection(this.collectionName);
                const query = { channel: this.data.channel };
                coll.findOneAndReplace(query, this.data).then(() => {
                    console.log("Saved the document.");
                    resolve();
                });
            });
        });
    }
}
