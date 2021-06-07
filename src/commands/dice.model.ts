import { IChatCommand, IChatCommandResult } from "../chat-command.interface";

export class DiceCommand implements IChatCommand {
    trigger = "!dice";

    rollDice() {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }

    execute(recipient: string | string[] | null, sender?: string): IChatCommandResult {
        const messages: string[] = [];
        const result = this.rollDice();
        messages.push(`Hey ${sender}, you rolled a ${result}`);
        return { isSuccessful: true, messages };
    }
}
