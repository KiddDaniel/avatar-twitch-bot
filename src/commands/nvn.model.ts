import { IChatCommand, IChatCommandResult } from "../chat-command.interface";

export class NvNCommand implements IChatCommand {
    trigger = ["!nvn"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        ret.messages.push(`Hey${sender}, NvN is not yet implemented!`);

        // const len : number = n.battleQueue.push(p.name);
        //  ret.messages.push(`Hey ${sender}, you are queued at pos #${len}!`);

        return ret;
    }
}
