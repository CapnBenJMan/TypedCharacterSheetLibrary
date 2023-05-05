/// <reference types="google-apps-script" />
/** Returns an object that contains an array of class names and the total level */
declare function getLevels(): {
	arr: string[]
	lvl: number
}
/** Sets buffer range to selection and opens editlevel dialog */
declare function levelBuffer(selection: string): void
declare function getClassEdit(): any
declare function clearClassEdit(): void
declare function getClassInfo():
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
declare function addEditInfo(
	className: string,
	subclass: string,
	level: number | string,
	hitdie: number | string,
	spells: string,
	x: number,
	selection?: string
): void
/** Adjusts current hit dice values so that they are never greater than their respective max values */
declare function adjustExpended(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
/** Adjusts the note on the classes cell that contains the named ranges for each level */
declare function adjustNote(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
/** Adds or removes named ranges depending on whether a class was added or removed */
declare function adjustNamedRanges(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void
/** Creates a new spells sheet or modifies an existing spells sheet to account
 * for the addition of a new caster class
 */
declare function doSpells(ss: GoogleAppsScript.Spreadsheet.Spreadsheet, Class: string, Subclass: string, spells: string): void
