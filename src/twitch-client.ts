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
} = {
    twitchClient: null,
    identity: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
    },
    channels: process.env.CHANNELS!.split(","),
};

export function getTwitchClient(): tmi.Client {
    if (globals.twitchClient === null) globals.twitchClient = tmi.client(globals);
    return globals.twitchClient;
}
