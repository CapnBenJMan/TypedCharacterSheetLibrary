/// <reference types="google-apps-script" />
/** Edits the weapons cells by either clearing their values and notes or autofilling their values by opening an HTML dialog */
declare function weapons(e: GoogleAppsScript.Events.SheetsOnEdit): void;
type ShortCharStats = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";
type WeaponDamage = `${number}d${number} ${string}` | `${number} ${string}` | "-";
type WeaponProps = "Ammunition" | "Finesse" | "Heavy" | "Light" | "Loading" | `Range (${number}/${number})` | "Reach" | `Thrown (${number}/${number})` | "Two-Handed" | `Versatile (1d${number})` | `Special\n\n${string}` | "-";
type SpecialWeapons = "lance" | "net";
type WeaponType = "melee" | "ranged";
declare class Weapon {
    name: string;
    damage: WeaponDamage;
    type: WeaponType;
    props: WeaponProps[];
    constructor(name: string, damage: WeaponDamage, type: WeaponType, ...props: WeaponProps[]);
}
/** Applies the values passed into the function to the edited cell */
declare function weaponSetter(name: string, prof: boolean, addBonus: boolean, bonuses: {
    bonus: number;
    attBonus: number;
    damBonus: number;
}, custom: {
    name: string;
    damage: WeaponDamage;
    props: WeaponProps[];
    type: WeaponType;
}, override: {
    bool: boolean;
    val: ShortCharStats;
    mw: boolean;
}): void;
/** Returns an array of objects that contains the information for each weapon */
declare function weaponInfo(): Weapon[];
