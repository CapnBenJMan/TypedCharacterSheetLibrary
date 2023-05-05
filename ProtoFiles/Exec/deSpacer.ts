import { readFile, writeFile, readdir } from "fs/promises"

export async function deSpacer(path: string) {

}

export async function deSpacerDir(path: string) {
	if (!["/", "\\"].some(x => path.endsWith(x))) path += "/"

	const fileNames = await readdir(path)

	const processed = await Promise.all(
		fileNames.map(async name => deSpacify(
			await readFile(path + name, "utf-8")
		))
	)
	processed.map((file, i) => {
		writeFile(path + fileNames[i], file)
	})
}

export function deSpacify(contents: string) {
	return contents.replace(/^(\t+) +([^ ].*)$/gm, "$1$2")
}