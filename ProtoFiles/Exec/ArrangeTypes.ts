import { readFileSync, readdirSync, writeFileSync } from "fs"
import promExec from "./promExec"
import { deSpacerDir } from "./deSpacer"
import { resolve } from "path"

const reference = `/// <reference types="google-apps-script" />`

const typeDIR = "../ProtoGS/Types/"

const typesPath = "../ProtoGS/CSCTypes.d.ts"

function collect() {


	const fileNames = readdirSync(typeDIR)

	const processed = fileNames.map(fileName => {
		const fileContents = readFileSync(`${typeDIR}${fileName}`, { encoding: "utf-8" })

		return `// ${fileName}\n\n` +
			fileContents.split("\n")
				.filter(x => !x.includes(reference))
				.map(x => x.replace("declare", "export"))
				.join("\n")

	})

	const final = `/// <reference types="google-apps-script" />

declare namespace CharacterSheetCode {

	${processed.join("\n\t\n\t\n\t")}

}`


	writeFileSync(typesPath, final)
}

async function post() {

	console.log(await promExec(`call npx prettier --config "./.prettierrc.json" -w "${typesPath}"`))
	const fileContents = readFileSync(typesPath, "utf-8")
	// let print = false
	const deSpaced = fileContents.replace(/^(\t+) +([^ ].*)$/gm, "$1$2")
	/* .split(/$\n?/gm)
		.map((x) => {
			if (x.includes("05-Equipment")) print = true
			else if (x.includes("06-Features")) print = false
			if (print) console.log(`"${x}"`)
			return x.replace(/(^\t+) +([^ ].+$)/, "$1$2")
		})
		.join("\n") */
	writeFileSync(typesPath, deSpaced)
}

async function pause(n: number) {
	await new Promise(res => setTimeout(res, n))
}

const interval = 50

async function main() {
	await pause(interval)
	await deSpacerDir(resolve(__dirname, typeDIR))
	await pause(interval)
	collect()
	await pause(interval)
	post()
}

main()