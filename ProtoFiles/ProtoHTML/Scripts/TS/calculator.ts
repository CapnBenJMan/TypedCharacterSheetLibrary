import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, Button, Input, Select, Div } from "../../../Master/JS"

document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	qryA('table tr>td>select').forEach(x => { // for each select element
		x.innerHTML = `<option value="plat">pp</option>
	<option value="gold">gp</option>
	<option value="silv">sp</option>
	<option value="copp">cp</option>` // set the options for coin types
	})
})

const conversions = { "plat": 1000, "gold": 100, "silv": 10, "copp": 1 } // object for coin conversions

/** Calculates the total for each coin type as a base */
function calculator() {
	const total = [1, 2, 3, 4].reduce((tot, i) => tot + Number(ID<Input>(`input${i}`).value) * Number(conversions[String(ID<Select>(`select${i}`).value)]), 0),
		// ^get the total from each input with their conversions applied
		keys = Object.keys(conversions) // get the keys from conversions
	for (let i = 3; i >= 0; i--) { // loop from plat to copp
		var temp = total // set temp to total
		for (let j = i; j >= 0; j--) { // loop from i to copp
			const mod = temp % 10 ** j // get the modulo of temp from 10^j
			qry(`.second tr:nth-child(${2 + j})>td:nth-child(${5 - i})`).innerHTML = <string><unknown>((temp - mod) / 10 ** j) // set the inner html of the selected cell to the calculated value
			temp = mod // reassign temp as mod
		}
	}
}

/** Imports current coin values from character sheet */
async function importer() {
	const vals = await runGoogleWithReturn('getCurrency') // get the character's coin values
	const keys = Object.keys(conversions) // get the keys of conversions
	for (let x = 0; x < 4; x++) { // loop through 0-3
		ID<Input>(`input${x + 1}`).value = vals[x] as unknown as string // set input to value
		ID<Select>(`select${x + 1}`).value = keys[x] // set select to keys
	}
}