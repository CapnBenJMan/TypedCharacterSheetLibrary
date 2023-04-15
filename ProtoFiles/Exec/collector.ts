// const { readdir, readFile, writeFile } = require("fs/promises")
// const { existsSync } = require("fs")

import { readdir, readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"

const typedPath = "C:\\Users\\ben\\Documents\\VSCode\\GAS\\Typed\\"
const protoHTML = `${typedPath}${"ProtoFiles\\ProtoHTML\\"}` as const


const inHTML = protoHTML + "HTML/"
const inJS = protoHTML + "Scripts/JS/"
const inCSS = protoHTML + "Styles/CSS/"

const outDir = typedPath + "HTML/"

const rf = async (x: string) => {
	if (existsSync(x))
		return readFile(x, { encoding: "utf-8" })
	return ""
}

async function main() {

	const masterJS = rf("../Master/JS.js")
	const masterCSS = rf("../Master/CSS.css")

	const htmlDir = await readdir(inHTML)

	const absFiles = htmlDir.map(async file => {
		file = file.replace(/\..+/, "")
		const htmlFile = rf(inHTML + `${file}.html`)
		const jsFile = rf(inJS + `${file}.js`)
		const cssFile = rf(inCSS + `${file}.css`)

		const scriptedFile = htmlFile.then(async x => {

			if (!x.includes("<!--script-->")) return x

			const tagged = `<script>
	// Master JS
	${await masterJS.then(tabber)}
	
	// ${file}.js
	${await jsFile.then(tabber)}
</script>`

			return x.replace("<!--script-->", tagged).replace(/^import .+"$/gm, "")

		})

		const styledFile = scriptedFile.then(async x => {

			if (!x.includes("<!--style-->")) return x

			const tagged = `<style>
	/* Master CSS */
	${await masterCSS.then(tabber)}
	
	/* ${file}.css */
	${await cssFile.then(tabber)}
</style>`

			return x.replace("<!--style-->", tagged)

		})

		return [file, await styledFile] satisfies [any, any]
	})

	Promise.all(absFiles).then(abs =>
		abs.forEach(([fileName, fileContents]) => {
			writeFile(outDir + fileName + ".html", fileContents)
			console.log(fileName)
		})
	)

	function tabber(str: string) {
		return str.split("\n").map((x, i) => i == 0 ? x : ("\t" + x)).join("\n")
	}
}

main()