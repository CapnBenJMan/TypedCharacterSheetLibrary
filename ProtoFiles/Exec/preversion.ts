import promExec from "./promExec"
import { resolve as R } from "path"

async function main() {
	await promExec(`ts-node ${R(__dirname, "./getLatestLibraryVersion.ts")}`)

	await promExec(`ts-node ${R(__dirname, "./updateMain.ts next")}`)
}

main()