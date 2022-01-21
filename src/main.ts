import * as tmi from "tmi.js";
import { argv } from "process";
import { globals } from "./twitch-client";
import { processClientMessage } from "./client-handler";
import { MongoDBStorage } from "./storage/mongodb-storage";
import { availableCommands } from "./chat-command-validator";
import { CommandsCommand } from "./commands/commands.model";

if (argv.length > 2 && argv[2] === "mongo") {
    globals.storage = new MongoDBStorage(globals.channels[0]);
}

globals.storage.load().then(() => {
    globals.twitchClient = tmi.client(globals);
    globals.twitchClient.on("message", processClientMessage);
    globals.twitchClient.on("connected", (address, port) => {
        console.log(`* Connected to ${address}:${port}`);
    });

    // doing this in the command validator produces a nasty dependency cycle
    availableCommands.push(new CommandsCommand());
    globals.twitchClient.connect().then();
});
