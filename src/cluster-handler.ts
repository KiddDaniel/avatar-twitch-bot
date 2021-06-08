import * as cluster from "cluster";
import * as tmi from "tmi.js";
import { ChatCommandFactory } from "./chat-command-factory";
import { ChatCommandJob } from "./chat-command-job.model";
import { IChatCommand, IChatCommandContext, IChatCommandJob, IChatCommandResult } from "./chat-command.interface";
import { getTwitchClient, globals, sleep } from "./twitch-client";
import { validateCommand } from "./chat-command-validator";

export function processClusterMessage(target: string, sender: tmi.Userstate, msg: string, isSelf: boolean) {
    if (isSelf) return;
    const context: IChatCommandContext | undefined = validateCommand(target, sender, msg);

    if (context === undefined) {
        return;
    }
    const job: IChatCommandJob = new ChatCommandJob(context.command, context.sender, context.recipients);

    const listener = (worker: cluster.Worker, result: IChatCommandResult) => {
        // this code is executed in context of the master
        if (result.messages !== undefined) {
            result.messages.forEach((mesg: string) => getTwitchClient().say(globals.channels[0], mesg));
        }
    };

    // only append this listener once
    if (cluster.listenerCount("message") === 0) {
        cluster.on("message", listener);
    }

    // Fork worker.
    // will be automatically queued for execution, but dont exaggerate here
    const worker: cluster.Worker = cluster.fork();
    console.log(`Starting job on worker ${worker.process.pid}`);
    // pass job to the worker via process.send()
    worker.send(job);
}

export function workerHandler() {
    cluster.worker.on("message", (message: IChatCommandJob) => {
        // can use artificial delay here in order to test
        sleep(globals.timeout).then(() => {
            // this code is executed in the context of the worker, if a job has been sent to it via process.send()
            // create a proper ChatCommand instance, in this case its a Greeting command
            // need a factory for creating commands by trigger
            const command: IChatCommand | undefined = ChatCommandFactory(message.context.command.trigger);
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
}
