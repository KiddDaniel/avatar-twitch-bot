enum InnatePlayerStats {
    Boldness = "Boldness",
    Intelligence = "Intelligence",
    Intuition = "Intuition",
    Charisma = "Charisma",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Strength = "Strength",
}

enum CalculatedPlayerStats {
    HP = "HP",
    BendingEnergy = "BendingEnergy",
    Toughness = "Toughness",
    Dodge = "Dodge",
    Initiative = "Initiative",
    Damage = "Damage",
}

type PlayerStats = {
    [key in InnatePlayerStats | CalculatedPlayerStats]: number;
};

export class Player {
    stats: PlayerStats;

    initializeStats() {
       Object.values(InnatePlayerStats).forEach((stat) => { this.stats[stat] = 1; });
    }

    levelUpStats() {
        Object.values(InnatePlayerStats).forEach((stat) => { this.stats[stat] += Math.round(Math.random()); });
    }

    evaluateCalculatedStats() {
        // TODO: Consider Stats from Items
        // HP
        this.stats.HP = 8 + this.stats.Constitution + this.stats.Strength;

        // Bending Energy
        this.stats.BendingEnergy =
         (this.stats.Constitution * (this.stats.Intuition + this.stats.Intelligence + this.stats.Dexterity)) / 6;

        // Tougness - TODO: divide by 100 to have a percentage?
        this.stats.Toughness = this.stats.Dexterity + (this.stats.Constitution * 2 + this.stats.Strength) / 6;

        // Dodge - TODO: divie by 100 do have a percentage?
        this.stats.Dodge = this.stats.Dexterity / 2;

        // Initiative
        this.stats.Initiative = (this.stats.Boldness + this.stats.Dexterity) / 2;

        // Damage - TODO: Change formula to updated version
        this.stats.Damage =
         (0.1 * this.stats.Boldness + this.stats.Strength + this.stats.BendingEnergy) / (1 + this.stats.BendingEnergy);
    }
}
