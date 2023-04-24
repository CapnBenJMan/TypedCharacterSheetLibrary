import json from "../../package.json"
import { writeFile } from "fs/promises"
import { resolve as R } from "path"
import promExec from "./promExec"

async function main() {
	const ex = await promExec("clasp deployments")

	const deployments = ex.split("\n").filter(x => x.length)
	const latest = deployments.at(-1)
	const latestVersion = Number(latest.match(/(?<=@)\d+(?= )/)[0])
	json.latestLibraryVersion = latestVersion
	const nJson = JSON.stringify(json, undefined, 4)
	const path = R(__dirname, "../../package.json")
	await writeFile(path, nJson)
	await promExec(`npx prettier --config ${R(__dirname, "./.prettierrc.json")} -w "${path}"`)
}

main()