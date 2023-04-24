import { version } from "../../package.json"
import promExec from "./promExec"
import { resolve as R } from "path"

async function main() {
	console.log(await promExec(`ts-node ${R(__dirname, "./getLatestLibraryVersion.ts")}`))

	console.log(await promExec(`ts-node ${R(__dirname, "./updateMain.ts next")}`))

	console.log(await promExec(`call ${R(__dirname, "./typeify.bat")}`))

	console.log(await promExec(`call ${R(__dirname, "./transpile.bat")}`))

	console.log(await promExec(`git add .`))

	console.log(await promExec(`git commit -m "v${version}"`))
}

main()