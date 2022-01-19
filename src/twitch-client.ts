import * as tmi from "tmi.js";
import * as dotEnv from "dotenv";
import { IStorage } from "./storage.interface";
import { FileStorage } from "./storage/file-storage";

dotEnv.config({ path: "./.env" });

export const globals: {
    twitchClient: tmi.Client | null;
    identity: {
        username: string;
        password: string;
    };
    channels: string[];
    // really need a good place to store the bot-internal structures
    storage: IStorage;
} = {
    twitchClient: null,
    identity: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
    },
    channels: process.env.CHANNELS!.split(","),
    storage: new FileStorage(),
};

export function getTwitchClient(): tmi.Client {
    if (globals.twitchClient === null) globals.twitchClient = tmi.client(globals);
    return globals.twitchClient;
}
