import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

qryA("input").forEach(x => x.autocomplete = "off")
let allowedTotal = 0
document.addEventListener("DOMContentLoaded", async () => {
	ID("loader").style.visibility = "visible"
	const elements = [
		ID("maxd6") as Div,
		ID("expendedd6") as Input,
		ID("maxd8") as Div,
		ID("expendedd8") as Input,
		ID("maxd10") as Div,
		ID("expendedd10") as Input,
		ID("maxd12") as Div,
		ID("expendedd12") as Input
	] satisfies [any, any, any, any, any, any, any, any]
	const values = await runGoogleWithReturn("getHitDice")
	allowedTotal = values.maxReplacement
	elements.forEach(elem => {
		const id = elem.id
		if (id.includes("maxd")) {
			const dieType = id.slice(-2).replace("d", "")
			elem.innerHTML = `Max d${dieType}: ${values[id]}`
		} else if (_a(elem, id)) {
			const maxType = id.slice(-2).replace("d", "")
			elem.min = values[id]
			elem.max = values[`maxd${maxType}`]
			elem.value = values[id]
		}

		function _a(e: typeof elem, id: string): e is Input {
			return id.includes("expendedd")
		}
	})
	ID("loader").style.visibility = "hidden"
})

async function update() {
	ID("loader").style.visibility = "visible"

	const parseVal = (id: string) => Number((<Input>ID(id)).value)
	const parseMin = (id: string) => Number((<Input>ID(id)).min)

	const startingValue = parseMin("expendedd6") + parseMin("expendedd8") + parseMin("expendedd10") + parseMin("expendedd12"),
		currentValue = parseVal("expendedd6") + parseVal("expendedd8") + parseVal("expendedd10") + parseVal("expendedd12")
	if (currentValue - startingValue > allowedTotal) {
		const error = ID("error")
		let dices = "dice"
		const allowed = currentValue - startingValue - allowedTotal
		if (allowed == 1) dices = "die"
		error.innerHTML =
			"Error: Your entered values exceed the maximum number of hit dice you are allowed to recover. " +
			`Please remove ${allowed} hit ${dices} and try again.`
		error.style.visibility = "visible"
		ID("loader").style.visibility = "hidden"
	} else {
		await runGoogle("updateHitDice", [parseVal("expendedd6"), parseVal("expendedd8"), parseVal("expendedd10"), parseVal("expendedd12")])
		google.script.host.close()
	}
}