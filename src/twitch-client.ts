import * as tmi from "tmi.js";
import * as dotEnv from "dotenv";

dotEnv.config({ path: "./.env" });

export const globals: {
    twitchClient: tmi.Client | null;
    identity: {
        username: string;
        password: string;
    };
    channels: string[];
    timeout: number;
} = {
    twitchClient: null,
    identity: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
    },
    channels: process.env.CHANNELS!.split(","),
    timeout: 5000,
};

export function getTwitchClient(): tmi.Client {
    if (globals.twitchClient === null) globals.twitchClient = tmi.client(globals);
    return globals.twitchClient;
}

export function sleep(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
