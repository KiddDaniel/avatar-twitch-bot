export interface IStats {
    readonly base: Record<string, number>;
}

export interface ICalculatedStats extends IStats {
    readonly formula: Record<string, string>;
}
