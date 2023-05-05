/// <reference types="google-apps-script" />
/**
 * @returns A1 Notation for currentCell's equivalent position in a page-layout storage sheet or currentCell's A1 Notation if not a part of a page-layout
 */
declare function getOuterRange(
	currentCell: GoogleAppsScript.Spreadsheet.Range,
	ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
	sheetName: string
): string
/** Checks if the range subRange intersects in any way with searchRange */
declare function isWithinRange(
	subRange: GoogleAppsScript.Spreadsheet.Range,
	...searchRange: GoogleAppsScript.Spreadsheet.Range[]
): {
	tf: boolean
	row: number
	col: number
}
/** Returns the value of the current cell and sheet passed through getOuterRange */
declare function selection(): string
/** Returns a boolean denoting if a sheet/cell combination exists */
declare function exists(sheet: string, cell: string): boolean
/** Used in the lookup dialog to get a website's html as a string
 * @returns {string} The HTML content of a website */
declare function returnFetch(url: string): string
/** Opens an html dialog */
declare function openHTML(file: string, titleOverride?: string): void
