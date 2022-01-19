import { INation } from "src/nation.interface";

export class Nation implements INation {
    name: string;
    members: string[] = [];
    wallet: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}
