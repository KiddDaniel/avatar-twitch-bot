import { IFighter, INation } from "../nation.interface";
import { getTwitchClient, globals, timer } from "../twitch-client";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { IPlayer } from "../player.interface";
import { battle } from "./pve.model";

export function nvnBattle(): IChatCommandResult {
    const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
    const na: INation[] = globals.storage.data.nations;

    // level on (average player level - 1) but at least level 1
    // maximum queue length of nations ?
    let max: number = 0;
    na.forEach((n: INation) => {
        if (n.nvnQueue.queue.length > max) {
            max = n.nvnQueue.queue.length;
        }
    });

    na.forEach((n: INation) => {
        if (n.nvnQueue.queue.length < 5) {
            n.wallet -= 250; // can be negative
            ret.messages.push(`Nation ${n.name} lost 250 Yuan because there were too little raiders`);
        } else {
            // fill with npcs up to max
            let avg: number = 0;
            n.nvnQueue.queue.forEach((s: IFighter) => {
                const player: IPlayer = globals.storage.data.players[s.name];
                avg += player.level;
            });
            avg /= n.nvnQueue.queue.length;
            const level: number = Math.round(avg - 1) < 1 ? 1 : Math.round(avg - 1);

            // fill up
            while (n.nvnQueue.queue.length < max) {
                const e: Record<string, number> = {
                    hp: 8 + 1 * level,
                    toughness: 0.8 * level * 0.01, // percentage, divide by 100
                    dodge: 0.4 * level * 0.01, // percentage, divide by 100
                    iniative: level,
                    damage: 1.1 * level,
                };
                n.nvnQueue.queue.push({
                    name: "",
                    nation: n.name,
                    level,
                    stats: e,
                });
            }
        }
    });

    // do the battles... randomized access over all 4 nation queues.
    let nt: number = 0;
    const fighting: boolean[] = Array<boolean>(na.length);
    fighting.fill(true);
    let stillFighting: boolean = true;
    let winner: number = 0;
    while (stillFighting) {
        for (nt = 0; nt < na.length; nt++) {
            const a: number = nt;
            let b: number = nt + 1;
            if (nt === na.length - 1) {
                b = 0;
            }

            const lenA: number = na[a].nvnQueue.queue.length;
            const lenB: number = na[b].nvnQueue.queue.length;

            if (lenA === 0) {
                fighting[a] = false;
            }

            if (lenB === 0) {
                fighting[b] = false;
            }

            let fA: IFighter | undefined;
            let fB: IFighter | undefined;
            let nA: number = 0;
            let nB: number = 0;
            if (lenA > 0) {
                nA = Math.floor(Math.random() * lenA);
                fA = na[a].nvnQueue.queue[nA];
            }

            if (lenB > 0) {
                nB = Math.floor(Math.random() * lenB);
                fB = na[b].nvnQueue.queue[nB];
            }

            if (fA && fB) {
                // duel here
                const win: IFighter = battle(fA, fB);
                if (win === fA) {
                    na[b].nvnQueue.queue.splice(nB, 1);
                } else {
                    na[a].nvnQueue.queue.splice(nA, 1);
                }
                // remove "loser" here
            }
        }

        let counter: number = 0;
        for (nt = 0; nt < na.length; nt++) {
            if (fighting[nt]) {
                counter++;
                // temporary winning nation during ongoing fight, here.
                winner = nt;
            }
        }

        stillFighting = counter > 1;
    }

    // the last winner when leaving the loop should be the final winning nation
    // it wins 250 yuan, every other loses 250.
    for (nt = 0; nt < na.length; nt++) {
        if (nt === winner) {
            na[nt].wallet += 250;
            ret.messages.push(
                `The nation of ${na[nt].name} has won the raid and earned 250 yuan, all others lose 250 yuan.`,
            );
        } else {
            na[nt].wallet -= 250;
        }
    }

    // remove last player
    na[winner].nvnQueue.queue = [];

    globals.storage.save();

    return ret;
}

export class NvNCommand implements IChatCommand {
    trigger = ["!nvn"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        const { data } = globals.storage;
        if (recipients.length === 0) {
            const user: string = sender;
            if (!(user in data.players)) {
                return error(user, "You cannot enter the nvn fight because you are not registered as player!");
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
                // streamer starts join timer, opens up queues for nations.
                if (sender === globals.storage.data.channel) {
                    n.nvnQueue.open = true;
                    getTwitchClient().say(globals.channels[0], "NvN queue has been opened.");
                    timer(n.nvnQueue.closeTimer).then(() => {
                        if (n !== undefined) {
                            getTwitchClient().say(globals.channels[0], "NvN queue has been closed, battle started.");
                            n.nvnQueue.open = false;
                            // start battle here
                            const res: IChatCommandResult = nvnBattle();
                            res.messages.forEach((m: string) => ret.messages.push(m));
                        }
                    });
                }

                if (!n.nvnQueue.open) {
                    return error(sender, `The nvn queue is closed, you cannot join.`);
                }

                // players join the nation battle queues (there is one per nation)
                const f: IFighter = {
                    name: p.name,
                    nation: n.name,
                    level: p.level,
                    stats: p.stats.calc,
                };
                if (n.nvnQueue.queue.includes(f)) {
                    return error(sender, `You have been already queued!`);
                }

                n.nvnQueue.queue.push(f);
            } else {
                return error(undefined, "Invalid nation at nvn slot insertion attempt!");
            }
        } else {
            return error(undefined, "Too many parameters for this command, expected 0 additional parameters.");
        }

        return ret;
    }
}
