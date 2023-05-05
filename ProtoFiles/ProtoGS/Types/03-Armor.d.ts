/// <reference types="google-apps-script" />
declare function armor(e: GoogleAppsScript.Events.SheetsOnEdit): void
interface ArmorBonuses {
	armor: number
	shield: number
	nat: number
	other: number
}
interface ArmorNotes {
	ba: string
	ud: string
	nat: string
	shield: string
	other: string
}
interface CustomArmor {
	name: string
	baseAC: number
	plusDex: boolean
	dexMax: number
	strReq: boolean
	minStr: number
	disStealth: boolean
}
type ArmorSelection = "ba" | "ud" | "nata" | "na"
declare class Armor {
	name: string
	ACText: string
	ACFormula: `=${string}`
	strReq: "-" | `Str ${number}`
	stealth: "-" | "Disadvantage"
	constructor(name: string, ACText: string, ACFormula: `=${string}`, strReq: "-" | `Str ${number}`, stealth: "-" | "Disadvantage")
}
declare const ArmorPieces: Armor[]
/** Sets the selected armor options and autofills the various formulas and notes */
declare function armorSetter(
	selection: ArmorSelection,
	armor: string,
	stat: string,
	natStat: string,
	shield: boolean,
	bonuses: ArmorBonuses,
	notes: ArmorNotes,
	custom: CustomArmor
): void
declare function armorInfo(): Armor[]
declare function getStr(): any
