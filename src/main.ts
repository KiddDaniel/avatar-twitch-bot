import * as tmi from "tmi.js";
import * as cluster from "cluster";
import { argv } from "process";
import { globals } from "./twitch-client";
import { processClientMessage } from "./client-handler";
import { MongoDBStorage } from "./storage/mongodb-storage";

if (argv.length > 2 && argv[2] === "mongo") {
    globals.storage = new MongoDBStorage(globals.channels[0]);
}

if (cluster.isMaster) {
    globals.storage.load().then(() => {
        globals.twitchClient = tmi.client(globals);
        globals.twitchClient.on("message", processClientMessage);
        globals.twitchClient.on("connected", (address, port) => {
            console.log(`* Connected to ${address}:${port}`);
        });

        globals.twitchClient.connect().then();

        cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
            console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
        });
    });
}
