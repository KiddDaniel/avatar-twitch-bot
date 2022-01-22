import { INation } from "src/nation.interface";
import { IPlayer, exp } from "src/player.interface";
import { globals } from "src/twitch-client";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";

// trigger one battle
export function pveBattle(): IChatCommandResult {
    // check nation slots, if free, there must be a sorted queue
    const cooldown: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
    const na: INation[] = globals.storage.data.nations;

    na.forEach((n: INation) => {
        // determine level distribution
        let max: number = 0;
        n.pveQueue.forEach((s: string) => {
            const player: IPlayer = globals.storage.data.players[s];
            if (player.level > max) {
                max = player.level;
            }
        });
        const distribution: number[] = Array<number>(max);
        distribution.fill(0);
        n.pveQueue.forEach((s: string) => {
            const player: IPlayer = globals.storage.data.players[s];
            distribution[player.level]++;
        });
        const chances: number[] = Array<number>(max + 1);
        chances.fill(0);
        let i: number = 0;
        const len: number = n.pveQueue.length;
        for (i; i < max; i++) {
            if (i === 0) {
                chances[i] = distribution[i] / len - 0.01;
            } else {
                chances[i] = chances[i - 1] + distribution[i] / max;
            }
        }
        chances[max] = 0.99; // the last 1 % chance

        if (!n.playerSlot) {
            const p: string | undefined = n.pveQueue.shift();
            if (p !== undefined) {
                // put player into fight and restart his cooldown
                n.playerSlot = globals.storage.data.players[p];
                globals.storage.data.players[p].cooldown.pve = Date.now() + cooldown;

                // make npc encounter ?
                // determine the level. slice the 0..1 according to distribution
                const rnd: number = Math.random();
                let level: number = 0;
                while (rnd > chances[level]) {
                    level++;
                }

                const e: Record<string, number> = {
                    hp: 8 + 2 * level,
                    toughness: level,
                    dodge: 0.5 * level,
                    iniative: level,
                    damage: 1.3 * level,
                    level,
                    id: 1, // mark the npc
                };
                n.npcSlot = e;
                // pair this with a real opponent ?
                // and attack... defend...
            } else {
                n.wallet -= 100; // can be negative
                ret.messages.push(`Nation ${n.name} lost 100 Yuan because nobody was there to fight`);
            }
        }
    });

    // battle. each nations player slot against its npc slot, iterate until hp is 0
    // small delay in fight....
    let i: number = 0;
    for (i; i < na.length; i++) {
        const a: Record<string, number> = na[i].playerSlot.stats.calc;
        a.level = na[i].playerSlot.level; // memorize here temporarily
        a.id = 0;

        const b: Record<string, number> = na[i].npcSlot;
        let att: Record<string, number> = a.initiative >= b.initiative ? a : b;
        let def: Record<string, number> = a.initiative >= b.initiative ? b : a;
        let tmp: Record<string, number>;

        while (att.hp > 0 && def.hp > 0) {
            let { damage } = att;
            const dodge: number = Math.random();
            const toughness: number = Math.random();
            if (dodge < def.dodge) {
                damage = 0;
            } else if (toughness < def.toughness) {
                damage = att.damage * 0.5;
            }

            def.be -= att.level * 0.1;
            def.hp -= damage;

            // swap roles...
            tmp = att;
            att = def;
            def = tmp;
        }

        if (att.hp <= 0) {
            // attacker lost, who was it ?
            // let who: string = att.id > 0 ? "npc" : "player";
            if (att.id === 0) {
                // player lost, but trostpreis 10 xp
                exp(na[i].playerSlot, 10);
                // money lost, though. or nation ?
                // na[i].playerSlot.wallet -= 100; // 100 yuan ?
                na[i].wallet -= 100;
                ret.messages.push(`Nation ${na[i].name} player lost the battle as attacker`);
            } else {
                exp(na[i].playerSlot, 100);
                // money lost, though. or nation ?
                // na[i].playerSlot.wallet -= 100; // 100 yuan ?
                na[i].wallet += 100;
                ret.messages.push(`Nation ${na[i].name} player won the battlea as attacker`);
            }
        }

        if (def.hp <= 0) {
            // attacker lost, who was it ?
            // let who: string = att.id > 0 ? "npc" : "player";
            if (def.id === 0) {
                // player lost, but trostpreis 10 xp
                exp(na[i].playerSlot, 10);
                // money lost, though. or nation ?
                // na[i].playerSlot.wallet -= 100; // 100 yuan ?
                na[i].wallet -= 100;
                ret.messages.push(`Nation ${na[i].name} player lost the battle as defender`);
            } else {
                exp(na[i].playerSlot, 100);
                // money lost, though. or nation ?
                // na[i].playerSlot.wallet -= 100; // 100 yuan ?
                na[i].wallet += 100;
                ret.messages.push(`Nation ${na[i].name} player won the battle as defender`);
            }
        }
    }

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
                const time: number = Date.now();
                if (!("pve" in p.cooldown)) {
                    // just initialize here
                    p.cooldown.pve = time;
                }

                if (time >= p.cooldown.pve) {
                    p.cooldown.pve = time + cooldown;
                    n.playerSlot = p;
                    n.pveQueue = [];
                    ret.messages.push(`Hey ${sender}, you are ready to fight!`);
                } else {
                    const hours: string = ((p.cooldown.pve - time) / (60 * 60 * 1000)).toFixed(2);
                    n.pveQueue.push(p.name);
                    // sort ascending
                    n.pveQueue.sort((a, b) => {
                        const pA: IPlayer = data.players[a];
                        const pB: IPlayer = data.players[b];
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

    /*
    Given I’m a player
    When I want to participate on a NPC fight
    Then one of each other nation has to join the fight

    Given I’m the first player without a fight cooldown
    When I enter the command !pve
    Then I will join the fight
    And I block the slot for the other members of my nation
    And my personal 24 hour cooldown is starting
    And I empty my nations queue // is not the whole queue being processed ?

    Given I’m a player
    When I want to enter a blocked slot
    Then my request would be rejected

    Given I’m a player already participated on a fight in the last 24 hours
    When I enter the command !pve
    Then i will be added to my nations queue

    Given there are not enough players without a fight cooldown
    When a fight is going to start
    Then the player with the least recent fight will join for his nation
    And his personal 24 hour cooldown is restarting

    Given there are not enough player for each nation
    When a fight is going to start
    Then the NPC wins the fight automatically
    And each of the nation loses 100 Yuan

    Given I’m a streamer
    When I’m online
    Then PvE fights will be triggered automatically in regular intervals

    Given an encounter
    When it’s generated
    Then it should be created according to the distribution rules
    And it should be created according to the encounter stats

    Given an encounter
    When it’s Battletime
    Then the NPC should attack with four instances

    Distribution Rules
    Encounter with the level of the highest reached player level +1 will occur with a chance of 1%
    All other levels will be distributed as the level distribution of the players
    The distribution of the lowest level will be reduced by 1 %
    e.g.:
    5 Lv1 Players; 3 Lv2 Players and 2 Lv3 Players
    => Encounter Lv1 49%; LV2 30%; LV3 20%; Lv4 1%
    Encounter Stats
    HP: 8 + 2 * Level
    Toughness: Level
    Dodge: 0.5 * Level
    Initiative: Level
    Damage: 1.3 * Level */
}
