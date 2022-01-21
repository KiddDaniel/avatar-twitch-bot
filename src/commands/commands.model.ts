import { availableCommands } from "../chat-command-validator";
import { IChatCommand, IChatCommandResult } from "../chat-command.interface";

export class CommandsCommand implements IChatCommand {
    trigger = ["!commands"];

    async execute(recipients: string[], sender: string): Promise<IChatCommandResult> {
        const ret: IChatCommandResult = { isSuccessful: true, messages: [] };
        let cmds: string = "";

        availableCommands.forEach((cmd: IChatCommand) => {
            cmd.trigger.forEach((trig: string) => {
                cmds = cmds.concat(trig, "; ");
            });
        });
        ret.messages.push(`Hey ${sender}, available commands: ${cmds}`);
        return ret;
    }
}
