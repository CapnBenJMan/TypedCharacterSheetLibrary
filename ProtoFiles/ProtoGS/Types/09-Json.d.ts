/// <reference types="google-apps-script" />
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
declare function jsonSwap(e: GoogleAppsScript.Events.SheetsOnEdit): void
