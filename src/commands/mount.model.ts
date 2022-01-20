import { Mount } from "../items/slots/mount";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";
import { CommandBase } from "./base.model";

export class MountCommand extends CommandBase implements IChatCommand {
    trigger = "!mount";

    async execute(recipient: string | string[] | null, sender?: string): Promise<IChatCommandResult> {
        if (sender === undefined) return this.error(sender, "No sender available");

        let normalizedRecipients: string[] = [];
        if (recipient) {
            if (Array.isArray(recipient)) {
                normalizedRecipients = recipient.map((x) => x.replace("@", ""));
            } else {
                normalizedRecipients = [recipient.replace("@", "")];
            }
        }

        const s: string = sender;
        const { data } = globals.storage;

        if (!(s in data.players)) {
            return this.error(s, "You cannot check your mount because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayMount(user);
        }

        return this.error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    handleDisplayMount(user: string) {
        const { data } = globals.storage;
        const m: Mount | null = Mount.getMount(data.players[user]);
        if (m === null) {
            return this.error(user, "You do not own a mount.");
        }

        const { expire } = m.items[0];

        // calculate remaining duration, approximately
        const days: number = (expire - Date.now()) / (1000.0 * 60.0 * 60.0 * 24.0);
        const sdays: string = days.toFixed(5);

        const upkeeps: number = data.players[user].inventory.slots.upkeep.items.length;

        return {
            isSuccessful: true,
            messages: [
                `Hey @${user}, your mount is a ${m.name} with a lifetime of ${sdays} days 
            with ${upkeeps} upkeeps left.`,
            ],
        };
    }
}
