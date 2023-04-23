import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

qryA('input').forEach(x => x.autocomplete = 'off') // turn off input autocomplete
var addedit: "add" | "edit", editrow: number

const loader = ID('loader')
document.addEventListener("DOMContentLoaded", async () => {
	loader.style.visibility = 'visible' // show loader
	const res = await runGoogleWithReturn('getClassInfo')
	addedit = res.arr[0] // gets the type of edit
	editrow = res.arr[1] // gets the edited row
	runGoogle('clearClassEdit') // removes the stored class edit in the character sheet
	switch (addedit) {
		case 'edit': // if editing a class
			function _a<T>(o: T): asserts o is NonNullable<T> { }
			_a(res.arr[2]!)

			ID<Input>('class').value = res.arr[2].class // store class value
			ID<Input>('subclass').value = res.arr[2].subclass // store subclass value
			ID<Input>('level').value = res.arr[2].level // store level
			ID<Input>('hitdie').value = res.arr[2].hitdie // store hitdie
			ID<Input>('spellcasting').value = res.arr[2].spells // store spells
			makeEditable() // run make editable
			break
		case 'add': // if adding a class
			makeEditable() // run make editable
			break
	}
	function makeEditable() { // makes each disabled or readonly element no longer like that
		['class', 'subclass', 'level', 'hitdie', 'spellcasting'].forEach(x => ID<Input>(x).readOnly = false); // readOnly setters
		['addedit', 'removeClass'].forEach(x => ID<Button>(x).disabled = false) // disabled setters
		ID<Input>('level').max = String((20 - res.lvl) + (res.arr[2] ? Number(res.arr[2].level) : 0)) // set level max
		loader.style.visibility = 'hidden' // hide loader
		console.log("Loaded")
	}
})

function submissionHandler(e: Event) {
	e.preventDefault() // stops form submission
	try {
		const a = ID<Input>('class').value,
			b = ID<Input>('level').value,
			c = ID<Input>('hitdie').value
		if (a != '' && b != '' && c != '') { // if each required input is not blank
			var className = capitalizer(a),
				subclass = ID<Input>('subclass').value,
				level = Number(b),
				levelMax = Number(ID<Input>('level').max),
				hitdie = Number(c),
				spells = ID<Input>('spellcasting').value
			if ([6, 8, 10, 12].some(x => x == hitdie) && level <= levelMax) { // if hitdie is a valid value and level is less than level max
				loader.style.visibility = 'visible' // show loader
				setTimeout(() => google.script.host.close(), 1500) // close dialog after 1.5s
				runGoogle("addEditInfo", [className, capitalizer(subclass), level, hitdie, spells, editrow, addedit]) // run addEditInfo with these arguments
			}
		} else console.log(a, b, c)
	} catch (err) { console.error(err) }
}

function removeClassClicker(e: Event) {
	e.preventDefault()
	loader.style.visibility = 'visible' // show loader
	setTimeout(() => google.script.host.close(), 1500) // close dialog after 1.5s
	runGoogle("addEditInfo", ['', '', '', '', '', editrow]) // run addEditInfo with mostly empty arguments
}