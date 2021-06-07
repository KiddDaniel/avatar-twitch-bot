import * as tmi from "tmi.js";
import * as cluster from "cluster";
import { argv } from "process";
import { globals } from "./twitch-client";
import { processClusterMessage, workerHandler } from "./cluster-handler";
import { processClientMessage } from "./client-handler";

if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker.process.pid} ready`);
    workerHandler();
} else {
    globals.twitchClient = tmi.client(globals);

    console.log(argv);
    if (argv.length > 2 && argv[2] === "--multicore") {
        globals.twitchClient.on("message", processClusterMessage);
    } else {
        globals.twitchClient.on("message", processClientMessage);
    }

    globals.twitchClient.on("connected", (address, port) => {
        console.log(`* Connected to ${address}:${port}`);
    });

    globals.twitchClient.connect().then();

    cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    });
}
