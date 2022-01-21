export interface IInventory {
    readonly slots: Record<string, IInventoryItemSlot>;
}

export interface IStockItem {
    amount: number;
    slot: string;
    item: IInventoryItem;
}

export interface IInventoryItemSlot {
    name: string;
    items: Array<IInventoryItem>; // limit this with purchase logic, equipment is max amount 1
}

export interface IInventoryItem {
    readonly name: string;
    readonly nation: string;
    readonly statRequired: Record<string, number>; // required stats, including the level which could be seen as stat
    readonly cost: number;
    readonly maxAmount: number;
    readonly statInfluence: Record<string, number>; // statname, and delta, plus or minus, or calculation expression
    // seconds how long this item is "existing", could be used for the upkeep of the mount too,
    // if the upkeep expires, the mount is dead.
    expire: number;
}
