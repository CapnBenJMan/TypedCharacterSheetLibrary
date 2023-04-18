import postcss from "postcss"
import postcssPresetEnv from "postcss-preset-env"
import postcssNested from "postcss-nested"
import postcssEach from "postcss-each"
import postcssCalc from "postcss-calc"
import postcssMath from "postcss-math"

import { readFileSync, readdirSync, writeFileSync } from "fs"

const preset = postcssPresetEnv({
	stage: 1, features: {
		"nesting-rules": false,
		"is-pseudo-class": true

	}
})
const each = postcssEach() as postcss.Plugin
const nested = postcssNested()
const calc = postcssCalc({})
const math = postcssMath() as postcss.Plugin

const processor = postcss([preset, each, nested, calc])
const processor1 = postcss([math])

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