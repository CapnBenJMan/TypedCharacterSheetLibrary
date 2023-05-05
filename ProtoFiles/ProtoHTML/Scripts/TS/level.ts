import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, show, hide } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

const formattedIDs = [] as [string, string][]


async function closer(evt: Button) {
	show(ID("loader")) // show loader
	if (evt.id == "addlevel") {
		await runGoogle("levelBuffer", ["addlevel"]) // add this to level buffer
		google.script.host.close() // close the dialog
	} else { // if editing a level
		const x = formattedIDs.find(item => item[0] == evt.id)! // get the item that matches the element
		await runGoogle("levelBuffer", [x[1]]) // add this to level buffer
		google.script.host.close() // close the dialog
	}
}
qryA("input").forEach(x => x.autocomplete = "off")
document.addEventListener("DOMContentLoaded", async () => { // on DOM Content Loaded
	show(ID("loader")) // show loader
	const className = await runGoogleWithReturn("getLevels") // get Levels and their info

	const formattedNames = className.arr.map(x => capitalizer(x).replace(/ /g, "")), // get formatted names
		html = formattedNames.reduce((tot, name, i) => {
			formattedIDs.push([`edit${name}`, className.arr[i]])
			return tot +
				`\n<button id="edit${name}" class="option" onclick="closer(this);">Level Up/Edit ${capitalizer(className.arr[i])}</button><br>`
		}, "<div>Select an option</div>") +
			(className.lvl < 20 ? `\n<button id="addlevel" class="option" onclick="closer(this);">Add New Class</button>` : "")
	// ^generate html with reduce function while also creating formattedIDs array
	ID("container").innerHTML = html // assign generated html to container innerHTML
	hide(ID("loader")) // hide loader
})