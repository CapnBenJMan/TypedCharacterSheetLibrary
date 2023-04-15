/// <reference path="google.d.ts" />
/// <reference path="../ProtoGS/CSCTypes.d.ts"/>

type CSC = typeof CharacterSheetCode

type csck = keyof CSC

type cscReturn<K extends csck> =
	CSC[K] extends (...args: any) => any ?
	ReturnType<CSC[K]> : CSC[K]

type cscParam<K extends csck> =
	CSC[K] extends (...args: any) => any ?
	Parameters<CSC[K]> : any[]

export type Button = HTMLButtonElement
export type Input = HTMLInputElement
export type Select = HTMLSelectElement
export type Div = HTMLDivElement

/** Returns the value of the function called
 * @param {string} f The function name
 * @param {any[]} [args] The arguments to be passed to the function
*/
export function runGoogleWithReturn<T extends csck>(f: T, args?: cscParam<T>): Promise<cscReturn<T>> {
	if (arguments.length == 1) return new Promise((resolve, reject) => {
		google.script.run
			.withSuccessHandler(stuff => resolve(stuff))
			.withFailureHandler(err => reject(err))
			.callLibraryFunction(`CharacterSheetCode.${f}`)
	})
	else /* if (arguments.length == 2) */ return new Promise((resolve, reject) => {
		google.script.run
			.withSuccessHandler(stuff => resolve(stuff))
			.withFailureHandler(err => reject(err))
			.callLibraryFunction(`CharacterSheetCode.${f}`, args!)
	})
}
/** Simply calls a function with no return value
 * @param {string} f The function name
 * @param {any[]} [args] The arguments to be passed to the function
*/
export function runGoogle<T extends csck>(f: T, args?: cscParam<T>): Promise<void> {
	if (arguments.length == 1) return new Promise<void>((resolve, reject) => {
		google.script.run
			.withSuccessHandler(() => resolve())
			.withFailureHandler(err => reject(err))
			.callLibraryFunction(`CharacterSheetCode.${f}`)
	})
	else /* if (arguments.length == 2) */ return new Promise<void>((resolve, reject) => {
		google.script.run
			.withSuccessHandler(() => resolve())
			.withFailureHandler(err => reject(err))
			.callLibraryFunction(`CharacterSheetCode.${f}`, args!)
	})
}

type HNM = HTMLElementTagNameMap

type Elem<K extends string> = K extends keyof HNM ? HNM[K] : Element

export const ID = <E extends HTMLElement = HTMLElement>(n: string) => document.getElementById(n) as E

export const qry = <K extends string, E extends Element = Elem<K>>(n: K, el: Element | Document = document) => el.querySelector(n) as E

export const qryA = <K extends string, E extends Element = Elem<K>>(n: K, el: Element | Document = document) => el.querySelectorAll(n) as NodeListOf<E>

export const capitalizer = (x: string) => {
	if (x.includes(' ')) { // if v includes spaces
		const arr = x.split(" ") // split v on spaces
		for (let j in arr) { // loop through arr
			if (arr[j].includes('\n')) break // break the loop if arr[j] includes \n
			else arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1).toLowerCase()
			// ^otherwise set arr[j] to itself capitalized
		}
		return arr.join(" ") // return the reformatted array joined by spaces
	} else return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase() // otherwise, return capitalized word
}