import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

const returns = runGoogleWithReturn("getHitDice")

document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	show(ID("loader")) // show loader
	const hitDice = await returns // get the return value of the returns promise
	console.log(hitDice) // log hitDice
	{
		[6, 8, 10, 12].forEach(i => { // loop throught dice types
			qry(`#d${i}>td:nth-child(2)`).innerHTML = hitDice[`expendedd${i}`] // set expended hit dice
			qry(`#d${i}>td>input`).max = hitDice[`maxd${i}`] // set max hit dice
		})
	}
	hide(ID("loader")) // hide loader
})

async function submission(e: Event) {
	e.preventDefault()
	const val = dx => Number(qry(`#${dx}>td>input`).value)
	// ^arrow function for getting the value of a certain die's input element as a number
	const hitDice = await returns // get hit dice from returns promise
	const dice = { d6: 0, d8: 0, d10: 0, d12: 0 } // dice object for getting the amount of hit dice that should be remaining
	for (const i in dice) dice[i] = Number(hitDice[`expended${i}`]) - val(i) // This calculates the values of the above comment
	setTimeout(() => { google.script.host.close() }, 1500) // close the dialog after 1.5s

	runGoogle("updateHitDice", [dice.d6, dice.d8, dice.d10, dice.d12, true,
		Number(ID<Input>("rolledhealth").value),
		[val("d6"), val("d8"), val("d10"), val("d12")]]) // run updateHitDice with these parameters
}

function clear0() {
	google.script.host.close() // closes the dialog
}