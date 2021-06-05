import * as tmi from "tmi.js";
import { globals } from "./twitch-client";
import { processClientMessage } from "./client-handler";

globals.twitchClient = tmi.client(globals);

globals.twitchClient.on("message", processClientMessage);

globals.twitchClient.on("connected", (address, port) => {
    console.log(`* Connected to ${address}:${port}`);
});

globals.twitchClient.connect().then();
