import { Item, ItemSlots } from "./item";
import { AllPlayerStats, InnatePlayerStat, PlayerStat, PlayerStats } from "./player-stats";

export type Inventory = {
    [value in ItemSlots]: Item;
};

export class Player {
    stats: PlayerStats;

    inventory: Inventory;
    yuan: number;

    // Sets all InnatePlayerStats in stats to 1
    initializeStats() {
       Object.values(InnatePlayerStat).forEach((stat) => { this.stats[stat] = 1; });
    }

    // Increases all InnatePlayerStats in stats by either 0 or 1 (50% chance for either)
    levelUpStats() {
        Object.values(InnatePlayerStat).forEach((stat) => { this.stats[stat] += Math.round(Math.random()); });
    }

    // Re-evalutes the CalculatedPlayerStats in stats
    evaluateCalculatedStats() {
        // Add InnatePlayerStats from Items
        Object.values(InnatePlayerStat).forEach((stat) => { this.calculateItemStats(stat); });

        const { stats } = this;
        // HP
        stats.HP = 8 + stats.Constitution + stats.Strength;
        this.calculateItemStats(PlayerStat.HP);

        // Bending Energy
        stats.BendingEnergy = (stats.Constitution * (stats.Intuition + stats.Intelligence + stats.Dexterity)) / 6;
        this.calculateItemStats(PlayerStat.BendingEnergy);

        // Tougness - TODO: divide by 100 to have a percentage?
        stats.Toughness = stats.Dexterity + (stats.Constitution * 2 + stats.Strength) / 6;
        this.calculateItemStats(PlayerStat.Toughness);

        // Dodge - TODO: divide by 100 do have a percentage?
        stats.Dodge = stats.Dexterity / 2;
        this.calculateItemStats(PlayerStat.Dodge);

        // Initiative
        stats.Initiative = (stats.Boldness + stats.Dexterity) / 2;
        this.calculateItemStats(PlayerStat.Initiative);

        // Damage - TODO: Change formula to updated version
        stats.Damage = (0.1 * stats.Boldness + stats.Strength + stats.BendingEnergy) / (1 + stats.BendingEnergy);
        this.calculateItemStats(PlayerStat.Damage);

         this.stats = stats;
    }

    calculateItemStats(statType: AllPlayerStats) {
        Object.values(ItemSlots).forEach((slot) => {
            const item = this.inventory[slot];
            if (item && item.stats.stat === statType) {
                this.stats[statType] += item.stats.value;
            }
        });
    }

    setItem(item: Item) {
        this.inventory[item.slot] = item;
    }
}
