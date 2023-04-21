import { readFileSync, readdirSync, writeFileSync } from "fs"

import { processor, processor1 } from "./PostCSSPlugins"


const path = "../ProtoHTML/Styles/"
const inDIR = path + "PostCSS/"
const outDIR = path + "CSS/"

const PostCSSFiles = readdirSync(inDIR.slice(0, -1))

PostCSSFiles.forEach(async (fileName) => {
	fileName = fileName.replace(/\..+/, "")
	const from = inDIR + fileName + ".pcss"
	const to = outDIR + fileName + ".css"
	const css = readFileSync(from, { encoding: "utf-8" })
	const result = processor.process(css).async()
		.then(x => processor1.process(x).async())

	writeFileSync(to, (await result).css)
	console.log(fileName + ".pcss")
})