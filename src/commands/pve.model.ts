import { IFighter, INation } from "src/nation.interface";
import { IPlayer, exp } from "src/player.interface";
import { getTwitchClient, globals, timer } from "src/twitch-client";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";

// return the winner
export function battle(a: IFighter, b: IFighter): IFighter {
    let tmp: IFighter;
    let att: IFighter = a.stats.initiative >= b.stats.initiative ? a : b;
    let def: IFighter = a.stats.initiative >= b.stats.initiative ? b : a;

    while (att.stats.hp > 0 && def.stats.hp > 0) {
        let { damage } = att.stats;
        const dodge: number = Math.random();
        const toughness: number = Math.random();
        if (dodge < def.stats.dodge) {
            damage = 0;
        } else if (toughness < def.stats.toughness) {
            damage = att.stats.damage * 0.5;
        }

        def.stats.be -= att.level * 0.1;
        def.stats.hp -= damage;

        // swap roles...
        tmp = att;
        att = def;
        def = tmp;
    }

    if (att.stats.hp <= 0) {
        return def;
    }

    return att;
}

export function pveDuel(p: IFighter, npc: IFighter): IChatCommandResult {
    const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
    let i: number = 0;
    let n: INation | undefined;
    for (i; i < globals.storage.data.nations.length; i++) {
        if (globals.storage.data.nations[i].name === p.nation) {
            n = globals.storage.data.nations[i];
            break;
        }
    }
    const player: IPlayer = globals.storage.data.players[p.name];

    if (n === undefined) {
        return error(undefined, "invalid nation in battle round");
    }

    const win: IFighter = battle(p, npc);

    if (win.name === "") {
        // player lost, but trostpreis 10 xp
        exp(player, 10);
        // money lost, though. or nation ?
        // player.wallet -= 100; // 100 yuan ?
        n.wallet -= 100;
        ret.messages.push(`Player ${p.name} of nation ${n.name} lost the battle`);
    } else {
        // the npc lost, hence we won. We approve ourselves 100 xp.
        exp(player, 100);
        // and some money for us (?) and the nation too ??!?
        player.wallet += 20;
        n.wallet += 100;
        ret.messages.push(`Player ${p.name} of nation ${n.name} won the battle`);
    }
    n.pveQueue.queue = [];

    return ret;
}

// battle time
export function pveBattle(): IChatCommandResult {
    // check nation slots, if free, there must be a sorted queue
    const cooldown: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
    const na: INation[] = globals.storage.data.nations;
    const npc: IFighter = {
        name: "",
        nation: "",
        stats: {},
        level: 0,
    };

    na.forEach((n: INation) => {
        // determine level distribution
        let max: number = 0;
        n.pveQueue.queue.forEach((f: IFighter) => {
            if (f.level > max) {
                max = f.level;
            }
        });
        const distribution: number[] = Array<number>(max);
        distribution.fill(0);
        n.pveQueue.queue.forEach((f: IFighter) => {
            distribution[f.level]++;
        });
        const chances: number[] = Array<number>(max + 1);
        chances.fill(0);
        let i: number = 0;
        const len: number = n.pveQueue.queue.length;
        for (i; i < max; i++) {
            if (i === 0) {
                chances[i] = distribution[i] / len - 0.01;
            } else {
                chances[i] = chances[i - 1] + distribution[i] / max;
            }
        }
        chances[max] = 0.99; // the last 1 % chance

        const f: IFighter | undefined = n.pveQueue.queue.shift();
        if (f !== undefined) {
            // put player into fight and restart his cooldown
            globals.storage.data.players[f.name].cooldown.pve = Date.now() + cooldown;

            // make npc encounter ?
            // determine the level. slice the 0..1 according to distribution
            const rnd: number = Math.random();
            let level: number = 0;
            while (rnd > chances[level]) {
                level++;
            }

            const e: Record<string, number> = {
                hp: 8 + 2 * level,
                toughness: level * 0.01, // percentage, divide by 100
                dodge: 0.5 * level * 0.01, // percentage, divide by 100
                iniative: level,
                damage: 1.3 * level,
            };

            npc.nation = n.name;
            npc.level = level;
            npc.stats = e;

            const r: IChatCommandResult = pveDuel(f, npc);
            r.messages.forEach((m: string) => ret.messages.push(m));
        } else {
            n.wallet -= 100; // can be negative
            ret.messages.push(`Nation ${n.name} lost 100 Yuan because nobody was there to fight`);
        }
    });

    globals.storage.save();

    return ret;
}

export class PvECommand implements IChatCommand {
    trigger = ["!pve"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const cooldown: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const { data } = globals.storage;
        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot enter the pve fight because you are not registered as player!");
            }

            const p: IPlayer = data.players[user];
            let n: INation | undefined;
            let i: number = 0;
            for (i; i < data.nations.length; i++) {
                if (data.nations[i].name === p.nation) {
                    n = data.nations[i];
                    break;
                }
            }

            if (n !== undefined) {
                if (sender === globals.storage.data.channel) {
                    n.pveQueue.open = true;
                    getTwitchClient().say(globals.channels[0], "PvE queue has been opened.");
                    timer(n.pveQueue.closeTimer).then(() => {
                        if (n !== undefined) {
                            getTwitchClient().say(globals.channels[0], "PvE queue has been closed, battle starts.");
                            n.pveQueue.open = false;
                            // start battle here
                            const res: IChatCommandResult = pveBattle();
                            res.messages.forEach((m: string) => ret.messages.push(m));
                        }
                    });
                }

                if (!n.pveQueue.open) {
                    return error(sender, `The pve queue is closed, you cannot join.`);
                }

                const time: number = Date.now();
                if (!("pve" in p.cooldown)) {
                    // just initialize here
                    p.cooldown.pve = time;
                }

                const f: IFighter = {
                    name: p.name,
                    nation: p.nation,
                    stats: p.stats.calc,
                    level: p.level,
                };

                if (time >= p.cooldown.pve && n.pveQueue.queue.length === 0) {
                    p.cooldown.pve = time + cooldown;
                    n.pveQueue.queue = [f]; // first one in new queue, first come first serve
                    ret.messages.push(`Hey ${sender}, you are ready to fight!`);
                } else {
                    const hours: string = ((p.cooldown.pve - time) / (60 * 60 * 1000)).toFixed(2);
                    n.pveQueue.queue.push(f);
                    // sort ascending
                    n.pveQueue.queue.sort((a: IFighter, b: IFighter) => {
                        const pA: IPlayer = data.players[a.name];
                        const pB: IPlayer = data.players[b.name];
                        return pB.cooldown.pve - pA.cooldown.pve;
                    });

                    return error(sender, `You have been queued, remaining cooldown is ${hours} hours !`);
                }
            } else {
                return error(undefined, "Invalid nation at pve slot insertion attempt!");
            }
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 additional parameters.");
        }

        return ret;
    }
}
