import promExec from "./promExec"
import { version, latestLibraryVersion } from "../../package.json"

async function main() {
	const verString = `v${version}`

	const tags = await promExec(`git tag -l`)

	if (tags.includes(verString)) {
		await promExec(`git tag -d ${verString}`)
		await promExec(`git push origin --delete ${verString}`)
	}

	console.log(await promExec(`git tag ${verString}`))

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
	} -d "${verString}"`))
}

main()