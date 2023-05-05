declare function sideBar(): void
/** Opens the sidebar */
declare function sideBarLoader(): void
/** Returns an array that contains the following in order:
 * * Current Health (number)
 * * Maximum Health (number)
 * * Temporary Health (number)
 * * Whether or not there is caster levels (boolean)
 * * ID of the current spreadsheet (string)
 * * Current version of the sheet/code (string)
 * * Bonus Health (number)
 */
declare function getCurrent(): [
	CurrentHealth: number,
	MaxHealth: number,
	TempHealth: number,
	HasCasterLevels: boolean,
	SheetId: string,
	SheetAndCodeVersions: string,
	BonusHealth: number
]
/** Takes in an object and sets the various health values based on its properties */
declare function health(HP: { cur: number; temp: number; bonus: number; readonly max?: number }): void
/** Returns an object containing every saving throw and ability/skill check's modifiers */
declare function getStats(): {
	strSave: number
	dexSave: number
	conSave: number
	intSave: number
	wisSave: number
	chaSave: number
	strCheck: number
	dexCheck: number
	conCheck: number
	intCheck: number
	wisCheck: number
	chaCheck: number
	prof: number
	init: number
	acrobaticsCheck: number
	animalCheck: number
	arcanaCheck: number
	athleticsCheck: number
	deceptionCheck: number
	historyCheck: number
	insightCheck: number
	intimidationCheck: number
	investigationCheck: number
	medicineCheck: number
	natureCheck: number
	perceptionCheck: number
	performanceCheck: number
	persuasionCheck: number
	religionCheck: number
	sleightCheck: number
	stealthCheck: number
	survivalCheck: number
}
type SpellType = "sc" | "pm"
type SpellLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type SpellSlotString = `${SpellType}${SpellLevel}`
/** Returns the values of each spell slot type and level */
declare function getSpells(): {
	scLvl: number
	pmLvl: number
} & {
	sc2?: number
	sc1?: number
	sc3?: number
	sc4?: number
	sc8?: number
	sc5?: number
	sc6?: number
	sc7?: number
	sc9?: number
	pm2?: number
	pm1?: number
	pm3?: number
	pm4?: number
	pm8?: number
	pm5?: number
	pm6?: number
	pm7?: number
	pm9?: number
}
/** Reduces a spell slot type of level n by 1 */
declare function useSpellSlot(n: number, type: string): void
interface Slot {
	dis: boolean
	val: number
}
/** Takes in an object containing the spell slot values for each type and level and sets them to the sheet */
declare function setSpellSlots(slots: {
	[K in SpellSlotString]: Slot
}): void
