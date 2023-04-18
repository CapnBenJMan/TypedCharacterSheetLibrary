type pseudo = `:${string}`
type stage = "start" | "child" | "gen" | "adj" | "desc"

class Selector<S extends string> {
	topElem: Elem

	constructor(str: S) {
		let elem: Elem
		let next: stage = "start"
		let nStr = str as string
		while (nStr != "") {

			nStr = nStr.replace(Elem.matchElem, val => {
				elem = new Elem(val)
				return ""
			}).trimStart()

			function _a<X>(o: X): asserts o is NonNullable<X> { }

			_a(elem!)
			switch (next) {
				case "start":
					this.topElem = elem
					break
				case "adj":
					this.deepest.adjSibling = elem
					break
				case "child":
					this.deepest.child = elem
					break
				case "desc":
					this.deepest.descendent = elem
					break
				case "gen":
					this.deepest.genSibling = elem
					break
			}

			if (nStr != "")
				switch (true) {
					case nStr.startsWith(">"):
						next = "child"
						break
					case nStr.startsWith("~"):
						next = "gen"
						break
					case nStr.startsWith("+"):
						next = "adj"
						break
					default:
						next = "desc"
						break
				}

			if (next != "desc") nStr = nStr.slice(1).trimStart()

		}
	}

	get deepest() {
		let elem = this.topElem
		while (!!elem.primeChild) {
			elem = elem.primeChild
		}

		return elem
	}


	private static pseudos = new Map<`$${number}$`, pseudo>()
	private static pseudoCount = 0
	private static replacer = (val: string) => {
		this.pseudos.set(`$${this.pseudoCount}$`, val as pseudo)
		return `$${this.pseudoCount++}$`
	}

	static parse(str: string) {
		console.log("\x1b[31m" + str + "\x1b[0m")

		str = str.replace(Elem.psClassMatch, this.replacer)
		str = str.replace(Elem.psElemMatch, this.replacer)

		const grouped = str.split(Selector.groupMatch).map(x => {

			for (let key of this.pseudos.keys()) {
				if (x.includes(key)) {
					x = x.replace(key, this.pseudos.get(key)!)
					this.pseudos.delete(key)
				}
			}

			return new Selector(x)
		})
		console.log(grouped.join(", "))
		console.log()
		return grouped
	}

	static groupMatch = /\s*?,\s*?/g

	static descendantMatch = /\s+?/g

	static childMatch = /\s*?>\s*?/g

	static genSiblingMatch = /\s*?~\s*?/g

	static adjSiblingMatch = /\s*?\+\s*?/g

	toString() {
		return "\x1b[32m" + this.topElem.toString() + "\x1b[0m"
	}
}

type elemId = `#${string}`
type elemClass = `.${string}`
type elemAttr = `[${string}]`
type elemPSC = `:${string}${`(${string})` | ""}`
type elemPSE = `::${string}${`(${string})` | ""}`
type elemAfter = Exclude<`${elemId | ""}${elemClass | ""}${elemAttr | ""}${elemPSC | ""}${elemPSE | ""}`, "">
type elemName<X extends string> =
	X extends keyof htmlTags | keyof svgTags ?
	X :
	X extends `${infer A extends string}${elemAfter}` ?
	A extends `${string}${elemAfter}` ?
	never :
	A :
	"elem"

// Utility Types

type trimLeft<S extends string> = S extends ` ${infer B}` ? trimLeft<B> : S

type trimRight<S extends string> = S extends `${infer B} ` ? trimRight<B> : S

type trim<S extends string> = trimLeft<trimRight<S>>

type replace<T extends string, S extends string, R extends string> =
	T extends `${infer A}${S}${infer B}` ?
	replace<`${A}${R}${B}`, S, R> :
	T


type flat<T extends any[]> = T extends [infer H, ...infer R]
	? H extends any[]
	? [...flat<H>, ...flat<R>]
	: [H, ...flat<R>]
	: T

type last<T extends any[], U = T extends (infer A)[] ? A : any> = T extends [...U[], infer B] ? B : never
type split<S extends string, D extends string, Acc extends any[] = []> =
	S extends `${infer A}${D}${infer B}` ?
	split<B, D, [...Acc, A]> :
	[...Acc, S]



type splitter<S extends string, D extends string, L extends string, R extends string, Acc extends string[] = []> =
	S extends `${infer A}${D}${infer B}` ?
	A extends L ?
	B extends R ?
	[...Acc, `${A}${D}${B}`] :
	splitter<B, D, L, R, [...Acc, A]> :
	splitter<B, D, L, R, [...Acc, A]> :
	[...Acc, S]
type trimmer<T extends string[]> = {
	[I in keyof T]: trim<T[I]>
}
type mapper1<T extends string[]> = {
	[I in keyof T]: splitter<T[I], " ", `${string}:${"has" | "is" | "where" | "not"}(${string}`, `${string})${string}`>
}
// actual operation
type parser<
	S_0 extends string,
	S_1 extends string = replace<S_0, `:${"has" | "is" | "where" | "not"}(${string})`, "">,
	S_2 extends string[] = split<S_1, ",">,
	S extends string = trimmer<S_2>[number],
	T1 extends string[] = split<S, ">" | "+" | "~">,
	T2 extends string[] = trimmer<T1>,
	T2_1 extends string[][] = mapper1<T2>,
	// @ts-ignore
	T2_2 extends string[] = flat<T2_1>,
	// @ts-ignore
	T3 extends string = last<T2_2>,
> = T3


type queryParser<
	S extends string,
	// @ts-ignore
	P extends string = parser<S>
> = elemName<P>

type htmlTags = HTMLElementTagNameMap
type svgTags = SVGElementTagNameMap
export type queryElem<
	S extends string,
	// @ts-ignore
	P = queryParser<parser<S>>
> =
	P extends keyof htmlTags
	? htmlTags[P] :
	P extends keyof svgTags
	? svgTags[P] :
	Element

type testString = 'input'
type testParser = parser<testString>
//    ^?
type testQueryParser = queryParser<testString>
//    ^?
type testQueryElem = queryElem<testString>
//    ^?


class Elem<T extends string = string, S = elemName<T>> {
	name: S = "elem" as S
	id: string
	classList = [] as string[]
	attrList = [] as Attribute[]
	psClass = [] as PseudoClass[]
	psElem = [] as PseudoElement[]

	child: Elem
	descendent: Elem
	genSibling: Elem
	adjSibling: Elem

	constructor(str: T) {
		let nStr = str as string
		// pseudo elemenet
		nStr = nStr.replace(Elem.psElemMatch, val => {
			this.psElem.push(new PseudoElement(val as `::${string} `))
			return ""
		})

		// pseudo class
		nStr = nStr.replace(Elem.psClassMatch, val => {
			this.psClass.push(new PseudoClass(val as `:${string} `))
			return ""
		})

		// attributes
		nStr = nStr.replace(Elem.attrMatch, val => {
			this.attrList.push(new Attribute(val as `[${string}]`))
			return ""
		})

		// classes
		nStr = nStr.replace(Elem.classMatch, val => {
			this.classList.push(val.slice(1))
			return ""
		})

		// id
		nStr = nStr.replace(Elem.idMatch, val => {
			this.id = val
			return ""
		})

		if (nStr != "") this.name = nStr as S
	}

	getName(): S {
		return this.name
	}

	get primeChild() {
		return this.child ?? this.descendent ?? this.adjSibling ?? this.genSibling ?? undefined
	}

	get primeChildConnection() {

		return !!this.child ? " > " :
			!!this.descendent ? " " :
				!!this.adjSibling ? " + " :
					!!this.genSibling ? " ~ " :
						""
	}

	static classMatch = /\.(?:\w|-)+/g

	static idMatch = /#(?:\w|-)+/g

	static attrMatch = /\[(?:\w|-)+(?:(?:~|\||\^|\$|\*)?=(['"]?).+\1(?: [iIsS])??)?\]/g

	static psClassMatch = /(?<!:):(?:\w|-)+(?:\((?:.+?)?\))?/g

	static psElemMatch = /::(?:\w|-)+(?:\((?:.+?)?\))?/g

	static matchElem = /(?:(?:\w|-)*(?:#(?:\w|-)+|\.(?:\w|-)+|\[(?:\w|-)+(?:(?:~|\||\^|\$|\*)?=(['"]?).+\1(?: [iIsS])??)?\]|:?:(?:\w|-)+(?:\((?:.+?)?\))?)+)|(?:\w|-)+/

	toString(): string {
		return `${this.name == "elem" ? "" : this.name
			}${this.id ?? ""
			}${this.classList.map(x => `.${x}`).join("")
			}${this.attrList.join("")
			}${this.psClass.join("")
			}${this.psElem.join("")
			}${this.primeChildConnection
			}${this.primeChild?.toString() ?? ""
			} `
	}
}

type Presence = typeof Attribute.presence

type pVals = Presence[keyof Presence]

type attrSensitive = ` ${"i" | "I" | "s" | "S"} ` | "none"

class Attribute {
	name: string
	type: keyof Presence = "present"
	value: string = ""
	sensitivity: attrSensitive = "none"

	constructor(str: `[${string}${"" | `=${string}`}]`) {
		const nStr = str.slice(1, -1)
		if (nStr.includes("=")) {
			const [name, after] = nStr.split("=")
			const type = name.slice(-1)
			if (_a(type)) {
				this.type = Attribute.swappedPresence[`${type}=`]
				this.name = name.slice(0, -1)
			} else {
				this.type = "exact"
				this.name = name
			}

			if (["i", "I", "s", "S"].some(x => after.endsWith(` ${x} `)))
				this.sensitivity = after.match(/ [is]$/i)![0] as attrSensitive

			this.value = after.replace(/ [is]$/gi, "")
		} else {
			this.name = nStr
		}

		function _a(t: string): t is Exclude<pVals, "" | "="> extends `${infer T}=` ? T : never {
			return Object.values(Attribute.presence).includes(t + "=" as pVals)
		}
	}

	static readonly presence = {
		"present": "",
		"exact": "=",
		"listMember": "~=",
		"beginsWithBar": "|=",
		"beginsWith": "^=",
		"endsWith": "$=",
		"contains": "*="
	} as const

	static readonly swappedPresence = pivotObject(this.presence)

	toString() {
		return `[${this.name}${Attribute.presence[this.type]}${this.value}${this.sensitivity == "none" ? "" : this.sensitivity}]`
	}
}

class Pseudo {

	constructor(
		public name: `:${string} `,
		public functional: boolean = false,
		public value: "" | `(${string})` = ""
	) { }

	static parenMatcher = /\(.+\)/

	toString() {
		return `${this.name}${this.value} `
	}
}

class PseudoClass extends Pseudo {

	constructor(str: `:${string} `) {
		const boolean = ["(", ")"].every(x => str.includes(x))
		const value = str.match(Pseudo.parenMatcher)?.[0] ?? ""
		super(str.replace(Pseudo.parenMatcher, "") as typeof str, boolean, value as ConstructorParameters<typeof Pseudo>[2])
	}
}

class PseudoElement extends Pseudo {
	declare name: `::${string} `

	constructor(str: `::${string} `) {
		const boolean = ["(", ")"].every(x => str.includes(x))
		const value = str.match(Pseudo.parenMatcher)?.[0] ?? ""
		super(str.replace(Pseudo.parenMatcher, "") as typeof str, boolean, value as ConstructorParameters<typeof Pseudo>[2])
	}
}

function pivotObject<O extends Record<PropertyKey, PropertyKey>>(
	obj: O
): { [K in keyof O as O[K]]: K } {
	const e = Object.entries(obj).map(([k, v]) => [v, k])
	return Object.fromEntries(e)
}


const tests = [
	"myClass",
	'path[id]',
	'svg',
	'line[data-eraseable]',
	'line[data-eraseable]',
	'.infobox #inspector',
	'.infobox #inspector',
	'g',
	'svg',
	'line[data-append]',
	'svg',
	'.plotbox',
	'svg :not(line)',
	'.infobox #index',
	'g[data-sel]',
	'g[data-sel]',
	'g[data-sel]',
	'path[id]',
	'g#container',
	'g#staging path',
	'g#container',
	'svg',
	'.infobox',
	'.infocontainer',
	'div.infobox',
	'svg',
	'svg rect',
	'div:has(span)',
	'div span, span :is(main, section, ) > div',
	'div[selection="any"]'
]

for (let test of tests) {
	Selector.parse(test)
}

const nSel = new Selector("div#main.container")

const nElem = nSel.deepest