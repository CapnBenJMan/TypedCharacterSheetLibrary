import promExec from "./promExec"
import { version, latestLibraryVersion } from "../../package.json"

async function main() {
	await promExec(`git tag v${version}`)

	await promExec("git push")

	await promExec("git push --tags")

	await promExec("clasp push")

	await promExec(`clasp deploy -V ${latestLibraryVersion + 1} -d "v${version}"`)
}

main()