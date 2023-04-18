import { readdirSync, readFileSync, writeFileSync } from "fs"

const path = __dirname + "\\..\\ProtoHTML\\Scripts\\TS\\"


for (let fileName of readdirSync(path)) {
	const file = readFileSync(path + fileName, { encoding: "utf-8" })

	writeFileSync(path + fileName,
		`import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"\n\n` +
		file.split("\n").filter(x => !/^\s*?import.+$/m.test(x)).join("\n").trim())
}