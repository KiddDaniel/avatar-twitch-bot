export enum InnatePlayerStat {
    Boldness = "Boldness",
    Intelligence = "Intelligence",
    Intuition = "Intuition",
    Charisma = "Charisma",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Strength = "Strength",
}

 export enum CalculatedPlayerStat {
    HP = "HP",
    BendingEnergy = "BendingEnergy",
    Toughness = "Toughness",
    Dodge = "Dodge",
    Initiative = "Initiative",
    Damage = "Damage",
}

export const PlayerStat = {
    ...InnatePlayerStat,
    ...CalculatedPlayerStat,
};

export type AllPlayerStats = InnatePlayerStat | CalculatedPlayerStat;

export type PlayerStats = {
    [value in AllPlayerStats]: number;
};

export type ItemStats = {
    stat: AllPlayerStats;
    value: number;
};
