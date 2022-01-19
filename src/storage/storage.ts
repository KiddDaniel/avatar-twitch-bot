import { StockItem } from "../items/stockitem";
import { IStorage } from "../storage.interface";
import { Nation } from "./nation";

export class Storage implements IStorage {
    load(): void {
        // not implemented here, but in base classes
    }

    save(): void {
        // not implemented here, but in base classes
    }

    players = {};
    devs = ["scorpion8182", "paigfx", "mrdeathappears", "BothLine"];
    nations = [new Nation("water"), new Nation("fire"), new Nation("air"), new Nation("earth")];
    stock = [
        new StockItem("mount", "flyingbison"),
        new StockItem("mount", "badgermole"),
        new StockItem("mount", "dragon"),
        new StockItem("mount", "polarbeardog"),
        new StockItem("upkeep", "baseupkeep"),
        new StockItem("shoe", "baseshoe"),
        new StockItem("chest", "basechest"),
        new StockItem("hat", "basehat"),
        new StockItem("coat", "basecoat"),
        new StockItem("pants", "basepants"),
    ];
}
