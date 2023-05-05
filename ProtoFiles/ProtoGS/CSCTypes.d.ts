/// <reference types="google-apps-script" />

declare namespace CharacterSheetCode {
	// 00-Main.d.ts

	export const libraryVersion = "v3.7.1"
	export const deploymentVersion = 39
	export function version(i: GoogleAppsScript.Events.SheetsOnOpen): void
	export function trigger(e: GoogleAppsScript.Events.SheetsOnEdit, id?: string): void
	export function preload(i: GoogleAppsScript.Events.SheetsOnOpen, id?: string): void

	// 01-Accounting.d.ts

	export function accounting(e: GoogleAppsScript.Events.SheetsOnEdit): void

	// 02-Accounting_Functions.d.ts

	type CapCoin = "Platinum" | "Gold" | "Silver" | "Copper"
	type ShortCoin = "plat" | "gold" | "silv" | "copp"
	export class Coin {
		private name
		private _raw
		private _change
		private _pts
		constructor(name: CapCoin, _raw: number, _change: number)
		applyChange(): void
		get raw(): number
		set raw(r: number)
		get pts(): number
		set pts(p: number)
		get change(): number
		set change(c: number)
		get mod(): 1 | 10 | 1000 | 100
	}
	export class CoinSet {
		plat: Coin
		gold: Coin
		silv: Coin
		copp: Coin
		name: string
		constructor(
			platinum?: number,
			gold?: number,
			silver?: number,
			copper?: number, // constructor: coin values and change values can be
			platChange?: number,
			goldChange?: number,
			silvChange?: number,
			coppChange?: number
		)
		setRaw(coin: ShortCoin, val: number): this
		setPoints(coin: ShortCoin, val: number): this
		setChange(arr?: any[]): this
		getRaw(container?: any[]): number[]
		getRaw(container: {}): {
			[K in ShortCoin]: number
		}
		getPoints(): number
		getPoints(container: any[]): number[]
		getPoints(container: {}): {
			[K in ShortCoin]: number
		}
		getChange(container?: any[]): number[]
		getChange(container: {}): {
			[K in ShortCoin]: number
		}
		copy(): CoinSet
		/**
		* Returns a new CoinSet using the values from the container.
		* If the container or changer is an array, it must be organized (from lowest index to highest)
		* by Platinum, Gold, Silver, Copper, and it must have a length of 4.
		* Otherwise, outputted object will not be what you want.
		* If the container is an object, it should have the outlined parameters.
		* The parameters should be able to be coerced into numbers without throwing an error
		* (ex. "20" and 20 are both acceptable). Otherwise, all undefined values are set to 0.
		*/
		static fromRaw(
			container:
				| {
						[K in ShortCoin]: any
				}
				| any[],
			changer?:
				| {
						[K in ShortCoin]: any
				}
				| any[]
		): CoinSet
		logVals(): void
		applyChange(): this
		distribute(): this
		distribute({
			coppMinDigits,
			silvMinDigits,
			goldMinDigits,
			platMinDigits,
		}: {
			[K in `${ShortCoin}MinDigits`]?: number
		}): this
		finalize(): {
			plat: number
			gold: number
			silv: number
			copp: number
		}
		getFormattedPoints(): string
		get coins(): Coin[]
		get points(): number
	}
	export function getCurrency(): number[]
	export function runManualDistributor(arr: number[]): void

	// 03-Armor.d.ts

	export function armor(e: GoogleAppsScript.Events.SheetsOnEdit): void
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
	export class Armor {
		name: string
		ACText: string
		ACFormula: `=${string}`
		strReq: "-" | `Str ${number}`
		stealth: "-" | "Disadvantage"
		constructor(name: string, ACText: string, ACFormula: `=${string}`, strReq: "-" | `Str ${number}`, stealth: "-" | "Disadvantage")
	}
	export const ArmorPieces: Armor[]
	/** Sets the selected armor options and autofills the various formulas and notes */
	export function armorSetter(
		selection: ArmorSelection,
		armor: string,
		stat: string,
		natStat: string,
		shield: boolean,
		bonuses: ArmorBonuses,
		notes: ArmorNotes,
		custom: CustomArmor
	): void
	export function armorInfo(): Armor[]
	export function getStr(): any

	// 04-Equipment.d.ts

	export const EquipmentInfo: {
		"Common Item": Equipment[]
		"Usable Items": Equipment[]
		Clothes: Equipment[]
		"Arcane Focus": Equipment[]
		"Druidic Focus": Equipment[]
		"Holy Symbols": Equipment[]
		Containers: Equipment[]
		Armor: Equipment[]
		Explosives: Equipment[]
		"Firearms (DMG)": Equipment[]
		"Firearms (Exandria)": Equipment[]
		"Tool Set": Equipment[]
		Weapons: Equipment[]
		Ammunition: Equipment[]
		"Equipment Pack": EquipmentPack[]
	}
	export function setEquipment(category: keyof typeof EquipmentInfo, name: string): string

	// 05-Equipment_Functions.d.ts

	interface Equipment {
		Name: string
		Cost: string
		Weight: string
		Quantity: string
		Note?: string
	}
	interface EquipmentPack {
		Name: string
		Cost: string
		Quantity: string
		Note: string
		Contents: Equipment[]
	}
	export function equipmentInfo(): {
		"Common Item": Equipment[]
		"Usable Items": Equipment[]
		Clothes: Equipment[]
		"Arcane Focus": Equipment[]
		"Druidic Focus": Equipment[]
		"Holy Symbols": Equipment[]
		Containers: Equipment[]
		Armor: Equipment[]
		Explosives: Equipment[]
		"Firearms (DMG)": Equipment[]
		"Firearms (Exandria)": Equipment[]
		"Tool Set": Equipment[]
		Weapons: Equipment[]
		Ammunition: Equipment[]
		"Equipment Pack": EquipmentPack[]
	}
	export function rawInfo(): {
		"Common Item": (
			| {
					Name: string
					Cost: string
					Weight: string
					Quantity: string
					Note?: undefined
			}
			| {
					Name: string
					Cost: string
					Weight: string
					Note: string
					Quantity: string
			}
		)[]
		"Usable Items": (
			| {
					Name: string
					Cost: string
					Weight: string
					Note: string
					Quantity: string
			}
			| {
					Name: string
					Cost: string
					Weight: string
					Quantity: string
					Note?: undefined
			}
		)[]
		Clothes: {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Arcane Focus": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Druidic Focus": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Holy Symbols": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		Containers: (
			| {
					Name: string
					Cost: string
					Weight: string
					Note: string
					Quantity: string
			}
			| {
					Name: string
					Cost: string
					Weight: string
					Quantity: string
					Note?: undefined
			}
		)[]
		Armor: {
			Name: string
			Weight: string
			Cost: string
			Quantity: string
		}[]
		Explosives: {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Firearms (DMG)": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Firearms (Exandria)": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		"Tool Set": {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		Weapons: {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
		Ammunition: {
			Name: string
			Cost: string
			Weight: string
			Quantity: string
		}[]
	}

	// 06-Features.d.ts

	export function features(e: GoogleAppsScript.Events.SheetsOnEdit): void
	export function complexFeatures(e: GoogleAppsScript.Events.SheetsOnEdit): void
	export function simpleFeatures(e: GoogleAppsScript.Events.SheetsOnEdit): void
	export function featureChange(e: GoogleAppsScript.Events.SheetsOnEdit): void

	// 07-Features_Functions.d.ts

	export function formulaCopy(start: GoogleAppsScript.Spreadsheet.Range, end: GoogleAppsScript.Spreadsheet.Range): void
	export function findPosition(
		searchKey: string | number,
		listType: "Simple" | "Complex" | "Weapons" | "Notes",
		sheetList: GoogleAppsScript.Spreadsheet.Sheet
	):
		| {
				row: number
				col: number
		}
		| undefined
	export function saveSimple(): void
	export function loadSimple(): void
	export function saveComplex(): void
	export function loadComplex(): void

	// 08-Health_(Depreciated).d.ts

	/** @deprecated */
	export function healthDepreciated(e: GoogleAppsScript.Events.SheetsOnEdit): void

	// 09-Json.d.ts

	interface JSONPage {
		values: any[][]
		notes: string[][]
		vals: ([string, any[]] | null)[][]
		merges: string[]
		backgrounds: string[][]
	}
	type Hori = "l" | "c" | "r"
	type Vert = "t" | "m" | "b"
	interface FontObject {
		f: string | null
		s: number | null
	}
	interface StyleObject {
		b?: string
		i?: string
		s?: string
		u?: string
	}
	interface JSONFormat {
		num: string[][]
		hori: Hori[][]
		vert: Vert[][]
		font: FontObject[][]
		color: string[][]
		styles: StyleObject[][]
	}
	export function jsonSwap(e: GoogleAppsScript.Events.SheetsOnEdit): void

	// 10-Json_Functions.d.ts

	export function validationBuilder(
		ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
		vals: JSONPage["vals"]
	): GoogleAppsScript.Spreadsheet.DataValidation[][]
	interface StyleBuilderJSON {
		b?: string
		i?: string
		s?: string
		u?: string
		c: string
		f: string | null
		si: number | null
	}
	export function textstyleBuilder(all: StyleBuilderJSON[][]): GoogleAppsScript.Spreadsheet.TextStyle[][]

	// 11-Misc_Functions.d.ts

	interface RowCol {
		row: number
		col: number
	}
	/** Returns true if a is undefined, null, an empty string, or '#N/A', otherwise returns false */
	export function isEmptyish(a: any): a is undefined | null | "" | "#N/A"
	/** Returns an array of numbers. Both the lower and upper limits are inclusive
	* @param {number} x The lower limit if y is also included, or it is the upper limit if y is not included
	* @param {number} y The upper limit
	* @param {number} z The rate of incrementation, defaults to 1
	*/
	export function numRange(x: number, y?: number, z?: number): number[]
	/** Returns a column number based on the alpha characters of a range string
	* @param {string} x Ex. 'A', 'BC', etc.
	*/
	export function A1toCol(x: string): number
	/** Fixes a series of broken imgur links in spreadsheet.
	*
	*/
	export function fixBrokenImages(): void

	// 12-Multiclass.d.ts

	/** Returns an object that contains an array of class names and the total level */
	export function getLevels(): {
		arr: string[]
		lvl: number
	}
	/** Sets buffer range to selection and opens editlevel dialog */
	export function levelBuffer(selection: string): void
	export function getClassEdit(): any
	export function clearClassEdit(): void
	export function getClassInfo():
		| {
				readonly arr: readonly ["add", number]
				readonly lvl: number
		}
		| {
				readonly arr: readonly [
					"edit",
					number,
					{
						class: any
						subclass: any
						level: any
						hitdie: any
						spells: any
					}
				]
				readonly lvl: number
		}
	/** Saves the inputted class info */
	export function addEditInfo(
		className: string,
		subclass: string,
		level: number | string,
		hitdie: number | string,
		spells: string,
		x: number,
		selection?: string
	): void
	/** Adjusts current hit dice values so that they are never greater than their respective max values */
	export function adjustExpended(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
	/** Adjusts the note on the classes cell that contains the named ranges for each level */
	export function adjustNote(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
	/** Adds or removes named ranges depending on whether a class was added or removed */
	export function adjustNamedRanges(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
	/** Creates a new spells sheet or modifies an existing spells sheet to account
	* for the addition of a new caster class
	*/
	export function doSpells(ss: GoogleAppsScript.Spreadsheet.Spreadsheet, Class: string, Subclass: string, spells: string): void

	// 13-Rest.d.ts

	/** This function handles the execution of the long rest code */
	export function longRest(): void
	/** This function handles the execution for the short rest code */
	export function shortRest(): void
	/** This function opens the dialog to add a rest rule to the sheet */
	export function addLongRest(): void
	/** This function removes a rest rule from the sheet */
	export function removeLongRest(): void
	/** This function adjusts the number of expended hit dice.
	* If less than half the total remains, opends a dialog asking for manual adjustment */
	export function adjustHitDice(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
	export function getHitDice(): {
		maxd6: number
		maxd8: number
		maxd10: number
		maxd12: number
		expendedd6: number
		expendedd8: number
		expendedd10: number
		expendedd12: number
		readonly maxReplacement: number
	}
	export function updateHitDice(d6?: number, d8?: number, d10?: number, d12?: number, bool?: boolean, plus?: number, initial?: any[]): void

	// 14-Rest_Runner.d.ts

	/** This function runs a short or long rest, handling which rules are  */
	export function restRunner(type: "long" | "short"): void

	// 15-Rest_Types.d.ts

	/** Compiles values inputted via the lrdialog
	*/
	export function restCompiler(range: string, type: string, sr: boolean, rest: string): void

	// 16-Side_Bar.d.ts

	export function sideBar(): void
	/** Opens the sidebar */
	export function sideBarLoader(): void
	/** Returns an array that contains the following in order:
	* * Current Health (number)
	* * Maximum Health (number)
	* * Temporary Health (number)
	* * Whether or not there is caster levels (boolean)
	* * ID of the current spreadsheet (string)
	* * Current version of the sheet/code (string)
	* * Bonus Health (number)
	*/
	export function getCurrent(): [
		CurrentHealth: number,
		MaxHealth: number,
		TempHealth: number,
		HasCasterLevels: boolean,
		SheetId: string,
		SheetAndCodeVersions: string,
		BonusHealth: number
	]
	/** Takes in an object and sets the various health values based on its properties */
	export function health(HP: { cur: number; temp: number; bonus: number; readonly max?: number }): void
	/** Returns an object containing every saving throw and ability/skill check's modifiers */
	export function getStats(): {
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
	export function getSpells(): {
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
	export function useSpellSlot(n: number, type: string): void
	interface Slot {
		dis: boolean
		val: number
	}
	/** Takes in an object containing the spell slot values for each type and level and sets them to the sheet */
	export function setSpellSlots(slots: {
		[K in SpellSlotString]: Slot
	}): void

	// 17-Side_Bar_Functions.d.ts

	/**
	* @returns A1 Notation for currentCell's equivalent position in a page-layout storage sheet or currentCell's A1 Notation if not a part of a page-layout
	*/
	export function getOuterRange(
		currentCell: GoogleAppsScript.Spreadsheet.Range,
		ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
		sheetName: string
	): string
	/** Checks if the range subRange intersects in any way with searchRange */
	export function isWithinRange(
		subRange: GoogleAppsScript.Spreadsheet.Range,
		...searchRange: GoogleAppsScript.Spreadsheet.Range[]
	): {
		tf: boolean
		row: number
		col: number
	}
	/** Returns the value of the current cell and sheet passed through getOuterRange */
	export function selection(): string
	/** Returns a boolean denoting if a sheet/cell combination exists */
	export function exists(sheet: string, cell: string): boolean
	/** Used in the lookup dialog to get a website's html as a string
	* @returns {string} The HTML content of a website */
	export function returnFetch(url: string): string
	/** Opens an html dialog */
	export function openHTML(file: string, titleOverride?: string): void

	// 18-Spells.d.ts

	/** Autofills a cell's note with the propper spell description */
	export function spells(e: GoogleAppsScript.Events.SheetsOnEdit): void

	// 19-Weapons.d.ts

	/** Edits the weapons cells by either clearing their values and notes or autofilling their values by opening an HTML dialog */
	export function weapons(e: GoogleAppsScript.Events.SheetsOnEdit): void
	type ShortCharStats = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha"
	type WeaponDamage = `${number}d${number} ${string}` | `${number} ${string}` | "-"
	type WeaponProps =
		| "Ammunition"
		| "Finesse"
		| "Heavy"
		| "Light"
		| "Loading"
		| `Range (${number}/${number})`
		| "Reach"
		| `Thrown (${number}/${number})`
		| "Two-Handed"
		| `Versatile (1d${number})`
		| `Special\n\n${string}`
		| "-"
	type SpecialWeapons = "lance" | "net"
	type WeaponType = "melee" | "ranged"
	export class Weapon {
		name: string
		damage: WeaponDamage
		type: WeaponType
		props: WeaponProps[]
		constructor(name: string, damage: WeaponDamage, type: WeaponType, ...props: WeaponProps[])
	}
	/** Applies the values passed into the function to the edited cell */
	export function weaponSetter(
		name: string,
		prof: boolean,
		addBonus: boolean,
		bonuses: {
			bonus: number
			attBonus: number
			damBonus: number
		},
		custom: {
			name: string
			damage: WeaponDamage
			props: WeaponProps[]
			type: WeaponType
		},
		override: {
			bool: boolean
			val: ShortCharStats
			mw: boolean
		}
	): void
	/** Returns an array of objects that contains the information for each weapon */
	export function weaponInfo(): Weapon[]

	// 20-Weapons_Functions.d.ts

	export function weaponSwap(e: GoogleAppsScript.Events.SheetsOnEdit): void
	export function notesSwap(e: GoogleAppsScript.Events.SheetsOnEdit): void
	export function saveWeapons(): void
	export function loadWeapons(): void
	export function saveNotes(): void
	export function loadNotes(): void
}
