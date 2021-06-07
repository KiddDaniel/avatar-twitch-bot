import { IChatCommand, IChatCommandContext, IChatCommandJob, IChatCommandResult } from "./chat-command.interface";

export class ChatCommandJob implements IChatCommandJob {
    context: IChatCommandContext;

    constructor(command: IChatCommand, sender: string, recipients: RegExpMatchArray | null) {
        this.context = { command, sender, recipients };
    }

    execute(): IChatCommandResult {
        return this.context.command.execute(this.context.recipients, this.context.sender);
    }
}
