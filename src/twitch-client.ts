import * as tmi from "tmi.js";
import * as dotEnv from "dotenv";
import { IStorage } from "./storage.interface";
import { FileStorage } from "./storage/file-storage";

dotEnv.config({ path: "./.env" });
const channels: string[] = process.env.CHANNELS!.split(",");

export const globals: {
    twitchClient: tmi.Client | null;
    identity: {
        username: string;
        password: string;
    };
    channels: string[];
    storage: IStorage;
} = {
    twitchClient: null,
    identity: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
    },
    channels,
    storage: new FileStorage(channels[0]),
};

export function getTwitchClient(): tmi.Client {
    if (globals.twitchClient === null) globals.twitchClient = tmi.client(globals);
    return globals.twitchClient;
}

export function timer(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
