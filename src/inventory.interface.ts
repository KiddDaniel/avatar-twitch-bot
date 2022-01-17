export interface IInventory {
    readonly slots: Record<string, IInventoryItem>;
}

export interface IInventoryItem {
    readonly name: string;
    amount: number; // mostly 1, mount is being considered as item too
    expire: number; // current expiration time
    readonly properties: IInventoryItemProperty;
}

export interface IInventoryItemProperty {
    readonly nation: string;
    readonly statRequired: Record<string, number>; // required stats, including the level which could be seen as stat
    readonly cost: number;
    readonly maxAmount: number;
    readonly statInfluence: Record<string, string>; // statname, and delta, plus or minus, or calculation expression
    readonly expire: number; // seconds how long this item is "existing", could be used for the upkeep of the mount too,
    // if the upkeep expires, the mount is dead.
}
