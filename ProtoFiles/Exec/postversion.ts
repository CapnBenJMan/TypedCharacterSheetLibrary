import promExec from "./promExec"
import { version, latestLibraryVersion } from "../../package.json"

async function main() {
	console.log(await promExec(`git tag v${version}`))

	console.log(await promExec("git push"))

	console.log(await promExec("git push --tags"))

	console.log(await promExec("clasp push"))

	console.log(await promExec(`clasp deploy -d "v${version}"`))
}

main()