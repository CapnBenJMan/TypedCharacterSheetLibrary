function armor(e: GoogleAppsScript.Events.SheetsOnEdit) { // armor onEdit function
	const characterSheet = e.source.getSheetByName("Character")! // define reference to Character sheet
	if (e.range.getSheet().getName() == "Character" && isWithinRange(e.range, characterSheet.getRange("Character!AI31:AN31")).tf) {
		// ^if edited range is in the character sheet and is in the correct range
		if (isEmptyish(e.value)) { // if edited cell was cleared
			e.source.getRangeByName("AC")!.setFormula("=10+Dex").setNote("Current Armor:\nUnarmored AC : 10 + Dex")
			// ^reset AC cell to default
			characterSheet.getRange(31, 35).clearNote() // clear equipped armor cell's note
			characterSheet.getRange("Z11").clearContent() // clear movement penalty
			characterSheet.getRange("H41").clearNote() // clear stealth disadvantage
		} else if (!isEmptyish(e.value) && isEmptyish(e.oldValue)) { // if cell's old value was blank and new value is not
			openHTML("armor") // open armor html
		}
	}
}

interface ArmorBonuses {
	armor: number,
	shield: number,
	nat: number,
	other: number
}

interface ArmorNotes {
	ba: string,
	ud: string,
	nat: string,
	shield: string,
	other: string
}

interface CustomArmor {
	name: string,
	baseAC: number,
	plusDex: boolean,
	dexMax: number,
	strReq: boolean,
	minStr: number,
	disStealth: boolean
}

type ArmorSelection = "ba" | "ud" | "nata" | "na"

class Armor {
	constructor(
		public name: string,
		public ACText: string,
		public ACFormula: `=${string}`,
		public strReq: "-" | `Str ${number}`,
		public stealth: "-" | "Disadvantage"
	) { }
}

const ArmorPieces = armorInfo() // define reference to Armor array

/** Sets the selected armor options and autofills the various formulas and notes */
function armorSetter(
	selection: ArmorSelection,
	armor: string,
	stat: string,
	natStat: string,
	shield: boolean,
	bonuses: ArmorBonuses,
	notes: ArmorNotes,
	custom: CustomArmor
) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const characterSheet = ss.getSheetByName("Character")! // define reference to Character sheet
	const selected = (armor.toLowerCase() != "custom") ?
		ArmorPieces.find(x => x.name.toLowerCase() == armor.toLowerCase())! :
		new Armor(
			custom.name,
			custom.baseAC.toString() + ((custom.plusDex) ? " + Dex modifier" : "") + ((custom.dexMax > 0) ? ` (max ${custom.dexMax})` : ""),
			`=${custom.baseAC}${(custom.plusDex) ? ((custom.dexMax > 0) ? `+min(Dex, ${custom.dexMax})` : "+Dex") : ""}`,
			(custom.minStr > 1) ? `Str ${custom.minStr}` : "-",
			(custom.disStealth) ? "Disadvantage" : "-"
		)/*  {
			name: ,
			ACText: custom.baseAC.toString() + ((custom.plusDex) ? ' + Dex modifier' : '') + ((custom.dexMax > 0) ? ` (max ${custom.dexMax})` : ''),
			ACFormula: `=${custom.baseAC}${(custom.plusDex) ? ((custom.dexMax > 0) ? `+min(Dex, ${custom.dexMax})` : '+Dex') : ''}`,
			strReq: (custom.minStr > 1) ? `Str ${custom.minStr}` : '-',
			stealth: (custom.disStealth) ? 'Disadvantage' : '-'
		} */
	// ^selected is the found value in the armor array or the custom values
	// for (i in selected) Logger.log(`${i}: ${selected[i]}`) // logs all values in selected object
	let note = "Current Armor:\n", formula = "" // define variables for the note and armor
	switch (selection) { // switch statement for selection
		case "ba": // if base armor was chosen
			note += `${selected.name} : ${selected.ACText}` + ((notes.ba != "" && bonuses.armor == 0) ? ` (${notes.ba})` : "")
			// ^create note for base armor comprised of the armor's name and its AC calculation
			formula = selected.ACFormula // set formula to the selected armor's ACFormula property
			if (bonuses.armor > 0) { // if user inputted an armor bonus greater than 0
				note += `\nArmor Bonus : +${bonuses.armor}` + (notes.ba != "" ? ` (${notes.ba})` : "")
				// ^add armor bonus text to note variable with a + 
				formula += `+${bonuses.armor}` // add armor bonus to formula variable
			} else if (bonuses.armor < 0) { // if user inputted an armor bonus less than 0
				note += `\nArmor Bonus : ${bonuses.armor}` + (notes.ba != "" ? ` (${notes.ba})` : "")
				// ^add armor bonus text to note variable
				formula += `${bonuses.armor}` // add armor bonus to formula variable
			}
			break
		case "ud": // if unarmored defense was chosen
			note += `Unarmored Defense : 10 + Dex + ${stat}` + (notes.ud != "" ? ` (${notes.ud})` : "")
			// ^add unarmored defense calculation + note to the note variable
			formula = `=10+Dex+${stat}` // set formula to 10 + Dex + the inputted stat
			break
		case "nata": // if natural armor was chosen
			note += `Natural Armor : ${bonuses.nat}` + ((notes.nat != "" && natStat == "") ? ` (${notes.nat})` : "")
			// ^add natural armor calculation + note to note variable
			formula = `=${bonuses.nat}` // sets formula to base armor
			if (natStat != "") { // if natStat is not blank
				note += ` + ${natStat}` + (notes.nat != "" ? ` (${notes.nat})` : "")
				// ^add natStat and accompanying note to note variable
				formula += `+${natStat}` // add natStat to formula
			}
			break
		case "na": // if no armor was chosen
			note += "Unarmored AC : 10 + Dex" // add unarmored AC calculation to note variable
			formula = "=10+Dex" // set formula to 10 + Dex
			break
	}
	if (shield) { // if user has a shield
		note += "\nShield : AC + 2" + ((notes.shield != "" && bonuses.shield == 0) ? ` (${notes.shield})` : "")
		// ^add shield calculation and note to note variable
		formula += "+2" // add +2 to the formula
		if (bonuses.shield > 0) { // if shield bonus is greater than 0
			note += `\nShield Bonus : +${bonuses.shield}` + (notes.shield != "" ? ` (${notes.shield})` : "")
			// ^add shield bonus calculation and note to note variable
			formula += `+${bonuses.shield}` // add shield bonus to formula
		} else if (bonuses.shield < 0) { // else if shield bonus is less than 0
			note += `\nShield Bonus : ${bonuses.shield}` + (notes.shield != "" ? ` (${notes.shield})` : "")
			// ^add shield bonus calculation and note to note variable
			formula += `${bonuses.shield}` // add shield bonus to formula
		}
	}
	if (bonuses.other > 0) { // if user added other bonus and it's greater than 0
		note += `\nOther Bonuses: +${bonuses.other}` + (notes.other != "" ? ` (${notes.other})` : "")
		// ^add other bonus calculation and note to note variable
		formula += `+${bonuses.other}` // add other bonus to formula
	} else if (bonuses.other < 0) { // if other bonus is less than 0
		note += `\nOther Bonuses: ${bonuses.other}` + (notes.other != "" ? ` (${notes.other})` : "")
		// ^add other bonus calculation and note to note variable
		formula += `${bonuses.other}` // add other bonus to formula
	}
	if (selection == "ba" && selected.stealth != "-") { // if user selected armor that has stealth disadvantage
		characterSheet.getRange("H41").setNote("Disadvantage")
		// ^set a note on the stealth stat that says a user has disadvantage
		note += "\nDisadvantage on Stealth Checks" // add disadvantage text to note
	}
	if (selection == "ba" && selected.strReq != "-") { // if user selected armor that has a strength requirement
		note += `\nRequires Strength of ${selected.strReq.slice(4)} to avoid movement penalty`
		// ^add strength requirement to note
		characterSheet.getRange("Z11").setFormula(`=if(C15<${selected.strReq.slice(4)}, "-10ft", "")`)
		// ^set strength requirement formula above speed cell
	}
	ss.getRangeByName("AC")!.setFormula(formula).setNote(note) // set AC formula and note
	characterSheet.getRange("AI31").setNote(note) // set AC note on current armor cell
}

function armorInfo() { // returns an array of objects with the same properties
	return [
		new Armor("Padded", "11 + Dex modifier", "=11+Dex", "-", "Disadvantage"),
		new Armor("Leather", "11 + Dex modifier", "=11+Dex", "-", "-"),
		new Armor("Studded Leather", "12 + Dex modifier", "=12+Dex", "-", "-"),
		new Armor("Hide", "12 + Dex modifier (max 2)", "=12+min(Dex,2)", "-", "-"),
		new Armor("Chain Shirt", "13 + Dex modifier (max 2)", "=13+min(Dex,2)", "-", "-"),
		new Armor("Scale Mail", "14 + Dex modifier (max 2)", "=14+min(Dex,2)", "-", "Disadvantage"),
		new Armor("Spiked Armor", "14 + Dex modifier (max 2)", "=14+min(Dex,2)", "-", "Disadvantage"),
		new Armor("Breastplate", "14 + Dex modifier (max 2)", "=14+min(Dex,2)", "-", "-"),
		new Armor("Halfplate", "15 + Dex modifier (max 2)", "=15+min(Dex,2)", "-", "Disadvantage"),
		new Armor("Ring Mail", "14", "=14", "-", "Disadvantage"),
		new Armor("Chain Mail", "16", "=16", "Str 13", "Disadvantage"),
		new Armor("Splint", "17", "=17", "Str 15", "Disadvantage"),
		new Armor("Plate", "18", "=18", "Str 15", "Disadvantage")
	]
}

function getStr() { // returns strength score
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const str = ss.getRangeByName("Str")!
	const row = str.getRow() + 2 // get row number of strength score
	const col = str.getColumn() // get column number of strength score
	return ss.getSheetByName("Character")!.getRange(row, col).getValue() // return the strength score
}