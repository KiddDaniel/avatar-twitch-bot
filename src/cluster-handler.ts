import * as cluster from "cluster";
import * as tmi from "tmi.js";
import { ChatCommandFactory } from "./chat-command-factory";
import { ChatCommandJob } from "./chat-command-job.model";
import { IChatCommand, IChatCommandJob, IChatCommandResult } from "./chat-command.interface";
import { DiceCommand } from "./commands/dice.model";
import { GreetingCommand } from "./commands/greeting.model";
import { getTwitchClient, globals, sleep } from "./twitch-client";

const availableCommands: IChatCommand[] = [new GreetingCommand(), new DiceCommand()];

export function processClusterMessage(target: string, sender: tmi.Userstate, msg: string, isSelf: boolean) {
    if (isSelf) return;
    if (msg.indexOf("!") < 0) {
        console.log(`* message dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
    }

    console.log(`* command received: no command - message: ${msg}, sender: ${sender.username}`);

    const commandsWithReceiver = msg.match(/!\w+(\s*@[\w|\d]*)*/g);
    if (!commandsWithReceiver || commandsWithReceiver.length <= 0) {
        console.log(`* command dropped: no command - message: ${msg}, sender: ${sender.username}`);
        return;
    }

    const firstCommandWithReceivers = commandsWithReceiver[0].trim().toLowerCase();
    const matchingAvailableCommand = availableCommands.find(
        (x) =>
            (!Array.isArray(x.trigger) && firstCommandWithReceivers.indexOf(x.trigger.toLowerCase()) === 0) ||
            (Array.isArray(x.trigger) &&
                x.trigger.some((trigger) => firstCommandWithReceivers.indexOf(trigger.toLowerCase()) === 0)),
    );

    if (!matchingAvailableCommand) {
        console.log("* dropping command: no handler found");
        return;
    }

    if (
        !matchingAvailableCommand.permittedUsers?.some((x) => x.toLowerCase() === sender.username?.toLowerCase()) &&
        (matchingAvailableCommand.allowedForMods || matchingAvailableCommand.allowedForSubscriber) &&
        (!(matchingAvailableCommand.allowedForMods && sender.mod) ||
            !(matchingAvailableCommand.allowedForSubscriber && sender.subscriber))
    ) {
        console.log(`* dropping command: no permission ${sender.username}: ${msg}`);
        return;
    }

    const recipients = firstCommandWithReceivers.match(/@[\w|\d]*/g);
    const job: IChatCommandJob = new ChatCommandJob(matchingAvailableCommand, sender.username, recipients);

    // matchingAvailableCommand.execute(recipients, sender.username)
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

    if (cluster.listenerCount("fork") === 0) {
        cluster.on("fork", (worker: cluster.Worker) => {
            console.log(`Starting job on worker ${worker.process.pid}`);
            // pass job to the worker via process.send()
            worker.send(job);
        });
    }

    // Fork worker.
    // will be automatically queued for execution, but dont exaggerate here
    cluster.fork();
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
