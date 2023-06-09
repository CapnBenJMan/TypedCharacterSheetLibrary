import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

const eqNames: ((CharacterSheetCode.Equipment | CharacterSheetCode.EquipmentPack) & { Category: string })[] = [] // equipment names
const prom = runGoogleWithReturn("equipmentInfo").then(equipment => {
	for (const a in equipment) for (const b in equipment[a]) {
		eqNames.push({ ...equipment[a][b], "Category": a })
	}
	// ^loop through equipment and push each item along with its category to eqNames
	eqNames.sort((a, b) => { // sort each item first by category, then by name
		if (a.Category > b.Category) return 1
		else if (a.Category < b.Category) return -1
		if (a.Name > b.Name) return 1
		else if (a.Name < b.Name) return -1
		return 0
	})
})

document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	const ih = ID("tbl").innerHTML // get the table's current innerHTML
	await prom // wait for eqNames to be finished
	ID("tbl").innerHTML = eqNames.reduce((str, cur) => str + `<tr data-sel="0" data-category=${cur.Category.replace(" ", "_")}>
		<td>${cur.Quantity}</td>
		<td>${cur.Name}</td>
		<td>${cur.Cost}</td>
		<td>${("Weight" in cur) ? cur.Weight : "-"}</td>
	</tr>`, ih) // reduce through eqNames and generate tr elements based on equipment items
	hide(ID("loader")) // hide loader
	addRowHandlers() // run addRowHandlers
})

function searcher() {
	const search = String(ID<Input>("searchbar").value).toLowerCase()
	for (const tr of Array.from(qryA("tr:has(td)", ID("tbl")))) {
		const category = tr.dataset.category!.replace("_", " ")
		const name = qry("*:nth-child(2)", tr).innerHTML
		if (![name, category].some(x => x.toLowerCase().includes(search))) {
			tr.style.display = "none"
			tr.dataset.sel = "0"
		} else tr.style.display = ""
	}
}

function addRowHandlers() { // adds event listeners to each tr element
	const table = ID<HTMLTableElement>("tbl") // get table element
	const rows = Array.from(table.getElementsByTagName("tr")) // get each tr element in table
	rows.forEach(currentrow => { // for each tr element
		const createClickHandler = (row: HTMLTableRowElement) => {
			return () => { // returns a handler function
				const bool = row.dataset.sel == "1" // if the row's selection value is 1
				qryA("tr[data-sel=\"1\"]").forEach((x: HTMLTableRowElement) => x.dataset.sel = "0") // set all selection values to 0
				if (!bool) row.dataset.sel = "1" // set selection value to 1 if selection value was 0
			}
		}
		currentrow.onclick = createClickHandler(currentrow) // add onclick handler
	})
}

type Category = keyof ReturnType<typeof CharacterSheetCode.equipmentInfo>

async function apply() {
	if (Array.from(qryA("tr[data-sel=\"1\"]")).length == 1) { // if there is only 1 selected row
		show(ID("loader")) // show loader
		ID<Button>("apply").disabled = true // disable the apply button
		const selRow = qry("tr[data-sel=\"1\"]") // get selected row
		const y = { "Category": String(selRow.dataset.category).replace("_", " ") as Category, "Name": qry("*:nth-child(2)", selRow).innerHTML }
		// ^get category and name of equipment item
		const rtrnd = await runGoogleWithReturn("setEquipment", [y.Category, y.Name]) // run setEquipment
		const obj = { // error object
			"sheet": "Error: The cell is not on the correct sheet. You can find the correct ranges on the Character and Storage sheets.",
			"range": "Error: The cell is not in the correct range. Make sure you have a range within the storage areas.",
			"blank": "Error: The cell(s) is/are not completely empty. Please clear them and try again.",
			"oob": "Error: The pack would exceed the bounds of the range. Try choosing a different starting position.",
		}
		if (rtrnd != "success" && rtrnd in obj) alert(obj[rtrnd])
		// ^if execution was not a success and error is accounted for, alert user of error
		else if (rtrnd != "success") { // otherwise if returned was not a success
			alert(`Error: Something went wrong that wasn't accounted for.`) // alert user of unaccounted for error
			console.error(rtrnd) // log returned value as an error
		}
		hide(ID("loader")) // hide loader
		ID<Button>("apply").disabled = false // enable apply button
	}
}