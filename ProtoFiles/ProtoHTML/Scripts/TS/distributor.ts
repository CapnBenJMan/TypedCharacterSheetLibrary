import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

let total: number

document.addEventListener("DOMContentLoaded", async () => {
	const currency = await runGoogleWithReturn("getCurrency") // get current currency values
	total = currency.reduce((total, x, i) => total + Number(x) * Math.pow(10, 3 - i), 0) // assign currency totals to total
	ID<Input>("available").value = String(total) // set available value to total
})

qryA("div>div>div>input").forEach(x => { // for each coin input
	x.onchange = () => { // create onchange listener
		const plat = Number(ID<Input>("plat").value) * 1000, // get platinum values
			gold = Number(ID<Input>("gold").value) * 100, // get gold values
			silv = Number(ID<Input>("silv").value) * 10, // get silver values
			copp = Number(ID<Input>("copp").value) // get copper values

		ID<Input>("available").value = String(total - (plat + gold + silv + copp)) // modify available value to reflect new values
	}
})

/** Applies the modified values to the accounting sheet */
async function handler() {
	if (Number(ID<Input>("available").value) == 0) { // if coin has been distributed properly
		const n = (x: string) => Number(ID<Input>(x).value) // arrow function for conveniecne
		await runGoogle("runManualDistributor", [[n("plat"), n("gold"), n("silv"), n("copp")]])
		// ^run manual distributor function for each coin value
		google.script.host.close() // close dialog
		return
	}
	ID("error").className = "" // show error
}