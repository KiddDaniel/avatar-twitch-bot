import * as tmi from "tmi.js";
import * as cluster from "cluster";
import { globals } from "./twitch-client";
import { executeJob, processClusterMessage } from "./cluster-handler";
import { IChatCommandJob } from "./chat-command.interface";
// import { processClientMessage } from "./client-handler";

function sleep(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker.process.pid} ready`);
    cluster.worker.on("message", (job: IChatCommandJob) => {
        cluster.worker.removeAllListeners("message");
        sleep(5000).then(() => {
            // this code is executed in the context of the worker, if a job has been sent to it via process.send()
            console.log(`Worker ${cluster.worker.process.pid} running`);
            const result = executeJob(job);
            // send result back to master
            cluster.worker.process.send(result);
            cluster.worker.disconnect();
        });
    });
} else {
    globals.twitchClient = tmi.client(globals);

    // globals.twitchClient.on("message", processClientMessage);
    globals.twitchClient.on("message", processClusterMessage);

    globals.twitchClient.on("connected", (address, port) => {
        console.log(`* Connected to ${address}:${port}`);
    });

    globals.twitchClient.connect().then();

    cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    });
}
