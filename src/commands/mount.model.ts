import { Mount } from "../items/slots/mount";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { getTwitchClient, globals } from "../twitch-client";

export class MountCommand implements IChatCommand {
    trigger = "!mount";

    error(s: string, msg: string) {
        getTwitchClient().say(globals.channels[0], `Hey @${s}, ${msg}`);

        return {
            isSuccessful: false,
            error: msg,
        };
    }

    execute(recipient: string | string[] | null, sender?: string): IChatCommandResult {
        if (sender === undefined) return { isSuccessful: false, error: "no sender" };

        let normalizedRecipients: string[] = [];
        if (recipient) {
            if (Array.isArray(recipient)) {
                normalizedRecipients = recipient.map((x) => x.replace("@", ""));
            } else {
                normalizedRecipients = [recipient.replace("@", "")];
            }
        }

        const s: string = sender;

        if (!(s in globals.storage.players)) {
            return this.error(s, "You cannot check your mount because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayMount(user);
        }

        return this.error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    handleDisplayMount(user: string) {
        const m: Mount | null = Mount.getMount(globals.storage.players[user]);
        if (m === null) {
            return this.error(user, "You do not own a mount.");
        }

        const data: string = m.name;
        const { expire } = m.items[0];

        // calculate remaining duration, approximately
        const days: number = (expire - Date.now()) / (1000.0 * 60.0 * 60.0 * 24.0);
        const sdays: string = days.toFixed(3);

        const upkeeps: number = globals.storage.players[user].inventory.slots.upkeep.items.length;

        getTwitchClient().say(
            globals.channels[0],
            `Hey @${user}, Your mount is a ${data} with a lifetime of ${sdays} days with ${upkeeps} upkeeps left.`,
        );

        return {
            isSuccessful: true,
        };
    }
}
