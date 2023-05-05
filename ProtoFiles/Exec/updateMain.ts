import { readFile, writeFile } from "fs/promises"
import { resolve as R } from "path"
import { argv } from "process"
import json from "../../package.json"

const path = R(__dirname, "../ProtoGS/TS/00-Main.ts")
async function main() {
	const file = await readFile(path, "utf-8")

	const libRe = /^const libraryVersion = "(.+)"$/m
	// const lib = file.match(libRe)?.[1]
	const depRe = /^const deploymentVersion = (\d+)$/m
	// const dep = Number(file.match(depRe)?.[1])

	const nFile = file.replace(libRe, `const libraryVersion = "v${json.version}"`)
		.replace(depRe, `const deploymentVersion = ${json.latestLibraryVersion + (argv[2] == "next" ? 1 : 0)
		}`)

	await writeFile(path, nFile)
}

main()