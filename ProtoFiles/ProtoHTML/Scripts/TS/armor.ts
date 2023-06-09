import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

qryA("input").forEach(x => x.autocomplete = "off") // prevent text inputs from showing autocomplete suggestions

let armorOptions: CharacterSheetCode.Armor[]
let str: number

function selector(x: string) {
	const n = { // object for looping through later
			baSelect: ID("armortypes") as Select,
			baBonus: ID("armorbonus") as Input,
			udSelect: ID("stats") as Select,
			natSelect: ID("nataStats") as Select,
			natBase: ID("natbase") as Input
		},
		warning1 = ID("warning1"), // this warning is for the strength requirement warning
		customarmor = ID("customarmor") // this is the custom armor span
	const current = armorOptions.find(y => y.name.toLowerCase() == n.baSelect.value.toLowerCase())! ?? {} as CharacterSheetCode.Armor,
		requirement = ("strReq" in current && current.strReq != "-") ? Number(current.strReq.slice(4)) : 0 // define requirement as the strength requirement for the current armor
	switch (x) {
		case "ba": // if base armor is selected
			for (const i in n) { // loop through n
				switch (i) {
					case "baSelect":
					case "baBonus":
						n[i].disabled = false // enable base armor selector and bonus input
						break
					default:
						n[i].disabled = true // disable everything else
						break
				}
			}
			if (str < requirement) show(warning1) // show warning1 if character's strength is too low
			else hide(warning1) // otherwise hide warning1
			break
		case "ud": // if unarmored defense is selected
			for (const i in n) { // loop through n
				switch (i) {
					case "udSelect":
						n[i].disabled = false // enable unarmored defense selector
						break
					default:
						n[i].disabled = true // disable everything else
						break
				}
			}
			hide(warning1) // hide warning1
			break
		case "nata": // if natural armor is selected
			for (const i in n) { // loop through n
				switch (i) {
					case "natSelect":
					case "natBase":
						n[i].disabled = false // enable natural armor selector and base input
						break
					default:
						n[i].disabled = true // disable everything else
						break
				}
			}
			hide(warning1) // hide warning1
			break
		case "na": // if no armor is selected
			for (const i in n) n[i].disabled = true // disable everything
			hide(warning1) // hide warning1
			break
	}
	customarmor.childNodes.forEach((y: Input) => y.disabled = !(x == "ba")) // disable each child element if base armor is not selected

	const customName = ID<Input>("customname")
	if (x === "ba" && n.baSelect.value === "Custom") customName.required = true // if custom base armor is selected, make the name required
	else customName.required = false // otherwise make the name not required

}

function viewer() {
	const shield = ID<Input>("shield"), // define reference to shield
		shieldBonus = ID<Input>("shieldbonus"), // define reference to shield bonus
		ud = ID<Input>("ud"), // define reference to unarmored defense
		warning = ID("warning") // define reference to unarmored defense shield warning
	if (shield.checked) { // if shield is selected
		shieldBonus.disabled = false // enable shield bonus input
		if (ud.checked) show(warning) // if unarmored defense is checked, show warning
		else hide(warning) // otherwise hide warning
	} else { // otherwise
		shieldBonus.disabled = true // disable shield bonus
		hide(warning) // hide warning
	}
}

const armor = ID<Select>("armortypes") // defines reference to type element and its options

async function submission(e: Event) { // runs on pressing the confirm button
	e.preventDefault()
	ID("loader").style.visibility = "visible" // set loader to visible
	const selection = Array.from(document.getElementsByName("selection")).find((x: Input) => x.checked)!.id as CharacterSheetCode.ArmorSelection
	await runGoogle("armorSetter", [
		selection, // selection in armorSetter
		armor.value, // armor in armorSetter
		ID<Select>("stats").value, // stat in armorSetter
		ID<Select>("nataStats").value, // natStat in armorSetter
		ID<Input>("shield").checked, // shield in armorSetter
		{ // bonuses in armorSetter
			armor: Number(ID<Input>("armorbonus").value),
			shield: Number(ID<Input>("shieldbonus").value),
			nat: Number(ID<Input>("natbase").value),
			other: Number(ID<Input>("otherbonus").value)
		},
		{ // notes in armorSetter
			ba: ID<Input>("banotes").value,
			ud: ID<Input>("udnotes").value,
			nat: ID<Input>("natnotes").value,
			shield: ID<Input>("shieldnotes").value,
			other: ID<Input>("othernotes").value
		},
		{ // custom in armorSetter
			name: ID<Input>("customname").value,
			baseAC: Number(ID<Input>("custombase").value),
			plusDex: ID<Input>("customcheck").checked,
			dexMax: Number(ID<Input>("dexmax").value),
			strReq: ID<Input>("strengthReq").checked,
			minStr: Number(ID<Input>("minSTR").value),
			disStealth: ID<Input>("customStealth").checked
		}
	])
	google.script.host.close() // wait for armor to be set, then close dialog
}

document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	armorOptions = await runGoogleWithReturn("armorInfo") // get the armor options
	const array = await armorOptions // set array to armor options
	const options = array.map(x => capitalizer(x.name)) // define options as the capitalised version of each name
	for (const a of options) { // loop through options
		const el = document.createElement("option") // create option element
		el.textContent = a // set text content and value to a
		el.value = a // ^^^
		armor.appendChild(el) // add el to armor
	}
	str = Number(await runGoogleWithReturn("getStr")) // get strength score and save to str variable
})

function changer() { // triggers when base armor is changed 
	const warning1 = ID("warning1"), // str requirement warning
		baSelect = ID<Select>("armortypes"), // base armor selector
		custom = ID("customarmor") // custom armor span
	try {
		if (baSelect.value.toLowerCase() !== "custom") { // if base armor selection is not custom
			ID<Input>("customname").required = false // make custom name input not required
			hide(custom) // hide custom if not already hidden
			const current = armorOptions.find(x => x.name.toLowerCase() == baSelect.value.toLowerCase())! // get current armor
			if (current.strReq != "-") doWarn(Number(current.strReq.slice(4))) // if current armor has a strength requirement, call doWarn
		} else if (baSelect.value.toLowerCase() === "custom") { // if base armor selection is custom
			show(custom) // show custom if not already shown
			ID<Input>("customname").required = true // make custom name input required
			if (ID<Input>("strengthReq").checked) doWarn(Number(ID<Input>("minSTR").value)) // call do warn if strength requirement is selected
		} else hide(warning1) // otherwise hide warning1
	} catch (err) { console.error(err) } // log error if error

	/** Shows or hides warning1 based on input
	 * @param {number} req */
	function doWarn(req: number) {
		if (baSelect.value.toLowerCase() !== "custom") { // if base armor selection is not custom
			if (str < req) show(warning1) // if str < req show warning1
			else hide(warning1) // otherwise hide warning1
		} else {
			if (str < req && ID<Input>("strengthReq").checked) show(warning1) // show warning1 if str < req
			else hide(warning1) // otherwise hide warning1
		}
	}
}

qryA("#form input[type=\"radio\"]").forEach(x => x.onchange = handler) // for each radio input, set the changer function to handler

/** Handles the selection between different armor types */
function handler() {
	const shield = ID<Input>("shield"), // shield selection
		strReq = ID<Input>("strengthReq"), // strength requirement
		warn = ID("warning"), // shield warning
		warn1 = ID("warning1"), // strength warning
		sel = Array.from(document.getElementsByName("selection")).find((x: Input) => x.checked)!.id // get id of selected radio button
	switch (sel) {
		case "ba": // case for base armor
			hide(warn) // hide shield warning
			const min = armor.value.toLowerCase() !== "custom" ? // strength minimum
				Number(armorOptions.find(x => x.name.toLowerCase() == armor.value.toLowerCase())!.strReq.slice(4)) :
				strReq.checked ? Number(ID<Input>("minSTR").value) : 0
			if (str < min) show(warn1) // if strength is less than minimum, show warning 1
			else hide(warn1) // otherwise, hide warning 1
			break
		case "ud": // case for unarmored defense
			hide(warn1) // hide strength requirement warning
			if (shield.checked) show(warn) // if shield is selected, show warning
			break
		default:
			hide(warn) // hide both warnings
			hide(warn1) // ^^^
	}
}

function customCheck() {
	const check = ID<Input>("customcheck") // +dex checkbox
	if (check.checked) show(ID("dexcontainer")) // if checked, show options
	else hide(ID("dexcontainer")) // otherwise, hide options
}

function customStr() {
	if (ID<Input>("strengthReq").checked) { // if custom strength requirement is checked
		show(ID("minstr")) // show strength requirement options
		if (str < Number(ID<Input>("minSTR").value)) show(ID("warning1")) // if str is less than minSTR val, show strength warning
	} else {
		hide(ID("minstr")) // hide strength requirement options and warning
		hide(ID("warning1")) // ^^^
	}
}