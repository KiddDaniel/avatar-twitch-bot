export class CommandBase {
    error(s: string | undefined, msg: string) {
        return {
            isSuccessful: false,
            error: s !== undefined ? `Hey @${s}, ${msg}` : msg,
            messages: s !== undefined ? [`Hey @${s}, ${msg}`] : [],
        };
    }
}
