import postcss from "postcss"
import postcssPresetEnv from "postcss-preset-env"
import postcssNested from "postcss-nested"
import postcssEach from "postcss-each"
import postcssCalc from "postcss-calc"
import postcssMath from "postcss-math"

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

export const processor = postcss([preset, each, nested, calc])
export const processor1 = postcss([math])