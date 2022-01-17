export interface IStats {
    readonly types: Array<string>;
    readonly values: Record<string, number>;
}

export interface ICalculatedStats extends IStats {
    readonly formula: Record<string, string>;
}
