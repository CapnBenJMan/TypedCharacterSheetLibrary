interface RowCol {
	row: number
	col: number
}
/** Returns true if a is undefined, null, an empty string, or '#N/A', otherwise returns false */
declare function isEmptyish(a: any): a is undefined | null | "" | "#N/A"
/** Returns an array of numbers. Both the lower and upper limits are inclusive
 * @param {number} x The lower limit if y is also included, or it is the upper limit if y is not included
 * @param {number} y The upper limit
 * @param {number} z The rate of incrementation, defaults to 1
 */
declare function numRange(x: number, y?: number, z?: number): number[]
/** Returns a column number based on the alpha characters of a range string
 * @param {string} x Ex. 'A', 'BC', etc.
 */
declare function A1toCol(x: string): number
/** Fixes a series of broken imgur links in spreadsheet.
 *
 */
declare function fixBrokenImages(): void
