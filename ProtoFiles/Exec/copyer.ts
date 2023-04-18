import { readdirSync, readFileSync, writeFileSync } from "fs"

const path = "../ProtoHTML/Scripts/TS/"

const DIR = readdirSync(path)

for (let fileName of DIR) {
	const contents = readFileSync(path + fileName, { encoding: "utf-8" })
	writeFileSync("./__TEMP/" + fileName, contents.replace(/^import.+$/gm, "").trim())
	console.log(fileName)
}