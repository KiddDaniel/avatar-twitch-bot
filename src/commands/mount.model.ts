import { Mount } from "../items/slots/mount";
import { error, IChatCommand, IChatCommandResult } from "../chat-command.interface";
import { globals } from "../twitch-client";

export class MountCommand implements IChatCommand {
    trigger = ["!mount"];

    async execute(normalizedRecipients: string[], sender: string): Promise<IChatCommandResult> {
        const s: string = sender;
        const { data } = globals.storage;

        if (!(s in data.players)) {
            return error(s, "You cannot check your mount because you are not registered as player!");
        }

        if (normalizedRecipients.length === 0) {
            const user: string = s;
            return this.handleDisplayMount(user);
        }

        return error(s, "Too many parameters for this command, expected 0 additional parameters.");
    }

    handleDisplayMount(user: string) {
        const { data } = globals.storage;
        const m: Mount | null = Mount.getMount(data.players[user]);
        if (m === null) {
            return error(user, "You do not own a mount.");
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
