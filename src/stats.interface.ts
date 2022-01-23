export interface IStats {
    base: Record<string, number>;
    calc: Record<string, number>;

    /* boldness: number;
    intelligence: number;
    intuition: number;
    charisma: number;
    dexterity: number;
    constitution: number;
    strength: number; */

    /* hp: number;
    be: number;
    toughness: number;
    dodge: number;
    initiative: number;
    damage: number; */
}

// TODO fully initialize the IStats object before using this function !!!!
export function calculate(st: IStats) {
    const { base } = st;
    const be: number = (base.constitution * (base.intuition + base.intelligence + base.dexterity)) / 6;
    const calc: Record<string, number> = {};
    calc.hp = 8 + st.base.constitution + st.base.strength;
    calc.be = be;
    calc.toughness = base.dexterity + (2 * base.constitution + base.strength) * 0.016;
    calc.dodge = base.dexterity * 0.05;
    calc.initiative = (base.boldness + base.dexterity) / 2;
    calc.damage = (0.1 * base.boldness + base.strength + be) / (1 + be);
    st.calc = calc;
}
