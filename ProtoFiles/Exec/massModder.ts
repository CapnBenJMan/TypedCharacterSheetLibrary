import { readdirSync, readFileSync, writeFileSync } from "fs"

const path = "C:\\Users\\ben\\Documents\\VSCode\\GAS\\Typed\\ProtoFiles\\ProtoHTML\\Scripts\\TS\\"

for (let fileName of readdirSync(path)) {
	const file = readFileSync(path + fileName, { encoding: "utf-8" })

	writeFileSync(path + fileName,
		`import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, Button, Input, Select, Div } from "../../../Master/JS"\n\n` +
		file.split("\n").slice(1).join("\n").trim())
}