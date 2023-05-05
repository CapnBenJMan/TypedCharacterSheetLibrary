/// <reference types="google-apps-script" />
declare function validationBuilder(
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
declare function textstyleBuilder(all: StyleBuilderJSON[][]): GoogleAppsScript.Spreadsheet.TextStyle[][]
