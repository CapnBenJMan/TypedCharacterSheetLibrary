import promExec from "./promExec"
import { version, latestLibraryVersion } from "../../package.json"

async function main() {
	console.log(await promExec(`git tag v${version}`))

	console.log(await promExec("git push"))

	console.log(await promExec("git push --tags"))

	console.log(await promExec("clasp push"))

	const latestVersion = (await promExec("clasp versions"))
		.split("\n")
		.filter(({ length }) => length)
		.at(-1).match(/(\d+) - /)?.[1]

	console.log(await promExec(`clasp deploy${(latestVersion &&
		Number(latestVersion) == latestLibraryVersion) ?
		"" : ` -V ${latestVersion}`
		} -d "v${version}"`))
}

main()