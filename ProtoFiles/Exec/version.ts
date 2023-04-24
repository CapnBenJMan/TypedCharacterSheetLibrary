import { version } from "../../package.json"
import promExec from "./promExec"
import { resolve as R } from "path"

async function main() {
	await promExec(`ts-node ${R(__dirname, "./getLatestLibraryVersion.ts")}`)

	await promExec(`ts-node ${R(__dirname, "./updateMain.ts next")}`)

	await promExec(`call ${R(__dirname, "./typeify.bat")}`)

	await promExec(`call ${R(__dirname, "./transpile.bat")}`)

	await promExec(`git add .`)

	await promExec(`git commit -m "v${version}"`)
}

main()