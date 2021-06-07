import * as tmi from "tmi.js";
import * as cluster from "cluster";
import { globals } from "./twitch-client";
import { processClusterMessage } from "./cluster-handler";
import { IChatCommand, IChatCommandJob } from "./chat-command.interface";
import { ChatCommandJob } from "./chat-command-job.model";
import { ChatCommandFactory } from "./chat-command-factory";
// import { processClientMessage } from "./client-handler";

function sleep(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker.process.pid} ready`);
    cluster.worker.removeAllListeners("message");
    cluster.worker.on("message", (message: IChatCommandJob) => {
        // can use artificial delay here in order to test
        sleep(1).then(() => {
            // this code is executed in the context of the worker, if a job has been sent to it via process.send()
            // create a proper ChatCommand instance, in this case its a Greeting command
            // need a factory for creating commands by trigger
            const command: IChatCommand | undefined = ChatCommandFactory(message.context.command);
            if (command !== undefined) {
                console.log(`Worker ${cluster.worker.process.pid} running`);
                // create a proper ChatCommandJob instance (this should have a method too then)
                const job = new ChatCommandJob(command, message.context.sender, message.context.recipients);
                const result = job.execute();
                // send result back to master
                cluster.worker.process.send(result);
            }

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
