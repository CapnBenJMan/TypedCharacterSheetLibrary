import { argv } from "process"
import { mkdir, readFile, writeFile, copyFile, rm } from "fs/promises"
import { processor, processor1 } from "./PostCSSPlugins"
import { resolve } from "path"
import { exec } from "child_process"

const baseDIR = resolve("./../..")
const finalHTMLDir = resolve(baseDIR, "./HTML")

const protoFiles = resolve(baseDIR, "./ProtoFiles")
const gsDIR = resolve(protoFiles, "./ProtoGS")
const protoHTMLDir = resolve(protoFiles, "./ProtoHTML")
const htmlTSDir = resolve(protoHTMLDir, "./Scripts/TS")
const htmlScriptsDir = resolve(protoHTMLDir, "./Scripts")
const htmlStylesDir = resolve(protoHTMLDir, "./Styles")

const fileName = argv[2].match(/^.+[\/\\](.+?)\.(?:html|ts|pcss)$/)[1]
console.log(fileName)


const rf = async (x: string) => readFile(x, "utf-8")

async function doPostCSS() {
	console.log("Starting PostCSS Transpiler")
	// Step 4: Transpile PostCSS to CSS
	const css = rf(resolve(htmlStylesDir, `./PostCSS/${fileName}.pcss`))
	const result = processor.process(await css).async()
		.then(x => processor1.process(x).async())

	await writeFile(resolve(htmlStylesDir, `./CSS/${fileName}.css`), (await result).css)
	// Step 5: Run Prettier on processed CSS

	new Promise<void>(res =>
		exec(
			`npx prettier --config ./.prettierrc.json -w "../ProtoHTML/Styles/CSS/${fileName}.css"`,
			() => res()
		)
	)
}

async function doHTMLTypescript() {
	console.log("Starting HTML TS Transpiler...")

	// Step 1: Copy proto-scripts to temp dir
	await mkdir(resolve("./__TEMP"))
	const file = readFile(resolve(htmlScriptsDir, `./TS/${fileName}.ts`), "utf-8")
	await writeFile(resolve(`./__TEMP/${fileName}.ts`), (await file).replace(/^import.+$/gm, ""))

	// Step 2: From temp dir, transpile ts to Scripts/JS/
	await new Promise<void>(res =>
		exec(
			`tsc -p ${resolve("./scriptsTSC.json")}`,
			() => res()
		)
	)

	// Step 3: Delete temp dir
	rm(resolve("./__TEMP"), { recursive: true, force: true })

}


async function htmlCompiler() {
	const TS = doHTMLTypescript().then(() => console.log("Finished HTML TS Transpilation"))
	const PCSS = doPostCSS().then(() => console.log("Finished PostCSS Transpilation"))

	// Step 6: Collect all components into a signle HTML file in Typed/HTML/
	const masterJS = rf(resolve("../Master/JS.js"))
	const masterCSS = rf(resolve("../Master/CSS.css"))

	const startHTMLDir = resolve(protoHTMLDir, "./HTML")
	const startJSDir = resolve(htmlScriptsDir, "./JS")
	const startCSSDir = resolve(htmlStylesDir, "./CSS")

	await Promise.all([TS, PCSS])

	console.log("Starting Combination...")
	const htmlFile = rf(resolve(startHTMLDir, `./${fileName}.html`))
	const jsFile = rf(resolve(startJSDir, `./${fileName}.js`))
	const cssFile = rf(resolve(startCSSDir, `./${fileName}.css`))


	const scriptedFile = htmlFile.then(async x => {

		if (!x.includes("<!--script-->")) return x

		const tagged = `<script>
	// Master JS
	${await masterJS.then(tabber)}
	
	// ${fileName}.js
	${await jsFile.then(tabber)}
</script>`

		return x.replace("<!--script-->", tagged).replace(/^import .+"$/gm, "")

	})

	const styledFile = scriptedFile.then(async x => {

		if (!x.includes("<!--style-->")) return x

		const tagged = `<style>
	/* Master CSS */
	${await masterCSS.then(tabber)}
	
	/* ${fileName}.css */
	${await cssFile.then(tabber)}
</style>`

		return x.replace("<!--style-->", tagged)

	})

	await writeFile(resolve(finalHTMLDir, `./${fileName}.html`), await styledFile)

	new Promise<void>(res =>
		exec(
			`npx prettier --config ./.prettierrc.json -w "../../HTML/*.html"`,
			() => res()
		))

	function tabber(str: string) {
		return str.split("\n").map((x, i) => i == 0 ? x : ("\t" + x)).join("\n")
	}
}


async function main() {
	if (argv[2].includes("ProtoHTML")) {
		htmlCompiler().then(() => console.log("Finished Combination"))
	} else if (argv[2].includes("ProtoGS")) {
		// gsCompiler
	}
}

main()