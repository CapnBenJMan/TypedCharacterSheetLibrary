import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, Button, Input, Select, Div } from "../../../Master/JS"

qryA('input').forEach(x => x.autocomplete = 'off') // disable autocomplete for each input element
document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	ID('loader').classList.remove('magic') // show loader

	const values = await runGoogleWithReturn("getHitDice") // get hit dice values
	{
		[6, 8, 10, 12].forEach(n => { // loop through each die type
			const max = ID(`maxd${n}`), expended = ID<Input>(`expendedd${n}`) // get max and expended elements for die type
			max.innerHTML = `Max d${n}: ${values[`maxd${n}`]}` // set the innerHTML of the max element
			expended.min = values[`expendedd${n}`] // set the min for expended input
			expended.max = values[`maxd${n}`] // set the max for expended input
			expended.value = values[`expendedd${n}`] // set the value for expended input
		})
	}
	ID('loader').classList.add('magic') // hide loader
})

async function update() {
	ID('loader').classList.remove('magic') // show loader
	let parseVal = (id: string) => Number(ID<Input>(id).value)
	await runGoogle("updateHitDice", [parseVal('expendedd6'), parseVal('expendedd8'), parseVal('expendedd10'), parseVal('expendedd12')])
	// ^update hit dice with inputted values
	google.script.host.close() // close dialog
}