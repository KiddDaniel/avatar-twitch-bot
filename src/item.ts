import { AllPlayerStats, ItemStats, PlayerStat } from "./player-stats";

export enum ItemSlots {
    Feet = "Feet",
    Legs = "Legs",
    Chest = "Chest",
    Back = "Back",
    Head = "Head",
}

// Map<Item.name, Item>
export const availableItems: Map<string, Item> = new Map<string, Item>();

export class Item {
    slot: ItemSlots;
    name: string;
    price: number;
    stats: ItemStats;

    constructor(slot: ItemSlots, name: string, price:number, stats: ItemStats) {
        this.slot = slot;
        this.name = name;
        this.price = price;
        this.stats = stats;
    }

    // TODO: Replace this function to read from json file instead
    static createAndStoreItem(slot: ItemSlots, name: string, price: number, stat: AllPlayerStats, value: number) {
        const newItem = new Item(slot, name, price, { stat, value });
        availableItems.set(newItem.name, newItem);
    }
}

// TODO: Probably read vom json file later
Item.createAndStoreItem(ItemSlots.Feet, "Shoes", 10, PlayerStat.Dexterity, 1);
Item.createAndStoreItem(ItemSlots.Legs, "Pants", 15, PlayerStat.Toughness, 1);
Item.createAndStoreItem(ItemSlots.Chest, "Shirt", 20, PlayerStat.HP, 1);
Item.createAndStoreItem(ItemSlots.Back, "Coat", 10, PlayerStat.Charisma, 1);
Item.createAndStoreItem(ItemSlots.Head, "Hat", 8, PlayerStat.Intelligence, 1);
