import { readFileSync, readdirSync, writeFileSync } from "fs"

const reference = `/// <reference types="google-apps-script" />`

const typeDIR = "../ProtoGS/Types/"

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

	${processed.join("\n\n\n")}

}`


writeFileSync("../ProtoGS/CSCTypes.d.ts", final)
