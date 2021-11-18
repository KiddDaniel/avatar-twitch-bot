import * as tmi from "tmi.js";
import * as dotEnv from "dotenv";
import { INation } from "./nation.interface";
import { IPlayer } from "./player.interface";

dotEnv.config({ path: "./.env" });

export const globals: {
    twitchClient: tmi.Client | null;
    identity: {
        username: string;
        password: string;
    };
    channels: string[];

    // really need a good place to store the bot-internal structures
    players: Record<string, IPlayer>;
    devs: string[];
    nations: Record<string, INation>;
} = {
    twitchClient: null,
    identity: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
    },
    channels: process.env.CHANNELS!.split(","),
    players: {},
    devs: ["scorpion8182", "paigfx", "mrdeathappears"], // and more :)
    nations: {
        ice: { name: "Ice", members: {} },
        fire: { name: "Fire", members: {} },
        earth: { name: "Earth", members: {} },
        air: { name: "Air", members: {} },
    },
};

// ToDo persistent storage of the players / devs record. ideally in JSON format. File ? small database ?

export function getTwitchClient(): tmi.Client {
    if (globals.twitchClient === null) globals.twitchClient = tmi.client(globals);
    return globals.twitchClient;
}
