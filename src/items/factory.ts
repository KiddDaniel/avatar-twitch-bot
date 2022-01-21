import { IInventoryItem } from "src/inventory.interface";
import { BaseChest } from "./equipment/chests/basechest";
import { BaseCoat } from "./equipment/coats/basecoat";
import { BaseHat } from "./equipment/hats/basehat";
import { BasePants } from "./equipment/pants/basepants";
import { BaseShoe } from "./equipment/shoes/baseshoe";
import { BaseUpkeep } from "./misc/baseupkeep";
import { BadgerMole } from "./mounts/badgermole";
import { Dragon } from "./mounts/dragon";
import { FlyingBison } from "./mounts/flyingbison";
import { PolarBearDog } from "./mounts/polarbeardog";

export class ItemFactory {
    static create(name: string): IInventoryItem | undefined {
        switch (name) {
            case "badgermole":
                return new BadgerMole();
            case "flyingbison":
                return new FlyingBison();
            case "dragon":
                return new Dragon();
            case "polarbeardog":
                return new PolarBearDog();
            case "baseshoe":
                return new BaseShoe();
            case "basechest":
                return new BaseChest();
            case "basehat":
                return new BaseHat();
            case "basecoat":
                return new BaseCoat();
            case "basepants":
                return new BasePants();
            case "baseupkeep":
                return new BaseUpkeep();
            default:
                return undefined;
        }
    }
}
