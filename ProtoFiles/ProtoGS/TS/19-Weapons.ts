/** Edits the weapons cells by either clearing their values and notes or autofilling their values by opening an HTML dialog */
function weapons(e: GoogleAppsScript.Events.SheetsOnEdit) {
	const characterSheet = e.source.getSheetByName("Character")! // define reference to Character sheet
	const rrow = e.range.getRow() // get the row of the edited range
	if (e.range.getSheet().getName() == "Character" && // if edited range is on the character sheet
		isWithinRange(e.range, characterSheet.getRange("Character!R32:W36")).tf) {
		// ^^and edited range is within the weapons range
		if (isEmptyish(e.value)) { // if user hit backspace
			characterSheet.getRange(rrow, 25).clear({ contentsOnly: true }).clearNote() // clear the contents and notes of each cell in the row
			characterSheet.getRange(rrow, 29).clear({ contentsOnly: true }).clearNote() // ^^^
		} else if (!isEmptyish(e.value) && isEmptyish(e.oldValue)) { // otherwise if user is adding a name to a previously empty cell
			characterSheet.getRange("AV4").setValue(rrow) // store current row in sheet
			openHTML("weapon") // open weapon dialog
		}
	}
}

type ShortCharStats =
	| "Str"
	| "Dex"
	| "Con"
	| "Int"
	| "Wis"
	| "Cha"

type WeaponDamage =
	| `${number}d${number} ${string}`
	| `${number} ${string}`
	| "-"
type WeaponProps =
	| "Ammunition"
	| "Finesse"
	| "Heavy"
	| "Light"
	| "Loading"
	| `Range (${number}/${number})`
	| "Reach"
	| `Thrown (${number}/${number})`
	| "Two-Handed"
	| `Versatile (1d${number})`
	| `Special\n\n${string}`
	| "-"
type SpecialWeapons =
	| "lance"
	| "net"
type WeaponType = "melee" | "ranged"

class Weapon {
	public props: WeaponProps[]

	constructor(
		public name: string,
		public damage: WeaponDamage,
		public type: WeaponType,
		...props: WeaponProps[]
	) {
		this.props = props
	}
}

/** Applies the values passed into the function to the edited cell */
function weaponSetter(
	name: string,
	prof: boolean,
	addBonus: boolean,
	bonuses: {
		bonus: number; attBonus: number; damBonus: number
	},
	custom: {
		name: string; damage: WeaponDamage; props: WeaponProps[]; type: WeaponType
	},
	override: { bool: boolean; val: ShortCharStats; mw: boolean }
) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const ui = SpreadsheetApp.getUi() // define ui reference
	const characterSheet = ss.getSheetByName("Character")! // define reference to character sheet
	const rrow = Number(characterSheet.getRange("AV4").getValue()) // get edited row from storage
	characterSheet.getRange("AV4").clearContent() // clear storage position
	const Weapons = weaponInfo() // get array of weapon objects
	const weapon = (name.toLowerCase() != "custom") ? // if name is not custom
		Weapons.find(x => x.name == name.toLowerCase())! : // return the object that matches the inputted name
		new Weapon(custom.name, custom.damage, custom.type, ...custom.props) // or the spread of the custom object parameter
	const dmg = weapon.damage.split(" ") // dmg = the split value of the weapon's damage

	let stat: ShortCharStats // declare stat, to be defined below
	if (weapon.type == "ranged") stat = "Dex" // if weapon is ranged, stat is dex
	else if (weapon.type == "melee") stat = "Str" // else if weapon is melee, stat is str
	stat = stat!

	if (!override.bool && weapon.props.includes("Finesse") && weapon.type == "melee") { // if weapon has the finesse property
		const res1 = ui.alert(`The weapon type you entered has the Finesse property.\n` +
			`Would you like to use Dexterity instead of Strength?`,
		ui.ButtonSet.YES_NO) // ask which stat the user would prefer to use

		if (res1 == ui.Button.YES) stat = "Dex" // and set stat accordingly
		else if (res1 == ui.Button.NO) stat = "Str"
	}

	/** Returns a number compiled as a string that begins with either + or -
	 * @param {number} n */
	const bonusCompiler = (n: number, i = false) => n != 0 ? `${i ? "(" : ""}${(n < 0 ? `${n}` : n > 0 ? `+${n}` : "")}${i ? ")" : ""}` : ""
	const noteBuilder = (x: Weapon) => {
		/** Capitalizes the traits of the weapon */
		const capitalizer = (v: string) => {
			if (v.includes(" ")) { // if v includes spaces
				const arr = v.split(" ") // split v on spaces
				for (const j in arr) { // loop through arr
					if (arr[j].includes("\n")) break 
					// ^break the loop if arr[j] includes \n
					else arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1).toLowerCase()
					// ^otherwise set arr[j] to itself capitalized
				}
				return arr.join(" ") // return the reformatted array joined by spaces
			} else return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() // otherwise, return capitalized word
		}

		const name = capitalizer(x.name) + bonusCompiler(bonuses.bonus) // capitalize name and add bonus
		const damg = capitalizer(x.damage) + " Damage" +
			((addBonus && (bonuses.attBonus != 0 || bonuses.damBonus != 0)) ?
				("\nAdditional Bonuses:" +
					((bonuses.attBonus != 0) ? `\n\tAttack: ${bonusCompiler(bonuses.attBonus)}` : "") +
					((bonuses.damBonus != 0) ? `\n\tDamage: ${bonusCompiler(bonuses.damBonus)}` : ""))
				: "")
		const props = capitalizer(x.props.join(", ")) // capitalize properties and join with ", "
		if (props != "-") { // if weapon has properties...
			return [name, damg, props].join("\n") // return the name, damage, and properties joined by \n
		} else { // otherwise...
			return [name, damg].join("\n") // return name and damage joined by \n
		}
	}

	const MartialArts = (ss.getRangeByName("MonkLvl") != null) && // the character has at least 1 level in monk and
		(override.mw || // ^^the inputted weapon is a monk weapon or
			["shortsword", "unarmed strike"].some(x => weapon.name.toLowerCase() == x) || // ^^the inputted weapon is a shortsword or unarmed strke or
			!["Heavy", "Two-Handed", "Two Handed"].some((x: WeaponProps) => weapon.props.includes(x))) // ^^the inputted weapon is not heavy or two handed
	// ^whether or not this weapon uses martial arts
	let useMA = weapon.name.toLowerCase() == "unarmed strike" && MartialArts
	// Sets the stat if it's not already Dex, if the stat isn't being overrided, and if MartialArts evaluates true
	if (stat != "Dex" && !override.bool && MartialArts) {
		const response1 = ui.alert(
			"You have at least 1 level in Monk.\n" +
			"Would you like to use your Dexterity instead of Strength?",
			ui.ButtonSet.YES_NO)
		if (response1 == ui.Button.YES) stat = "Dex"
	}
	if (!useMA && !override.bool && MartialArts && weapon.name.toLowerCase() != "unarmed strike") {
		const response1 = ui.alert(
			"You have at least 1 level in Monk.\n" +
			"Would you like to use your Martial Arts die in place of your weapon's regular damage?",
			ui.ButtonSet.YES_NO)
		useMA = (response1 == ui.Button.YES)
	}
	stat = override.bool ? override.val : stat
	let note = noteBuilder(weapon)
	const addAttack = stat + bonusCompiler(bonuses.bonus) + (addBonus ? bonusCompiler(bonuses.attBonus) : "") + (prof ? "+Prof" : "")
	const addDamage = stat + bonusCompiler(bonuses.bonus) + (addBonus ? bonusCompiler(bonuses.damBonus) : "")
	const frmla = {
		atk: `=if(text(${addAttack}, "0")="0", "+0", ${addAttack})`,
		dmg: dmg[0] == "-" ? `="-"` :
			useMA ? `=if(text(${addDamage}, "0")="0", vlookup(MonkLvl,AR28:AS47,2,1), join("+",vlookup(MonkLvl,AR28:AS47,2,1),text(${addDamage},"0")))` :
				`=if(text(${addDamage}, "0")="0", "${dmg[0]}", ifs(${addDamage}>0,join("+","${dmg[0]}",text(${addDamage},"0")), ${addDamage}<0,join("","${dmg[0]}",text(${addDamage},"0"))))`
	} // define frmla object that contains attack and damage elements, each containing their own formulas
	if (useMA) note = note.replace(/^\d{1,2}d?\d{1,2} (.* Damage)$/m, "$1 equal to Martial Arts Die")
	// ^if weapon uses martial arts, modify note to show damage using martial arts dice
	if (useMA && weapon.name.toLowerCase() == "unarmed strike") note = "Unarmed Strike\nBludgeoning Damage equal to Martial Arts Die"
	// ^if weapon is unarmed strike and if character uses martial arts, set unarmed strike note
	characterSheet.getRange(rrow, 25).setFormula(frmla.atk) // set attack formula
	characterSheet.getRange(rrow, 29).setFormula(frmla.dmg).setNote(note) // set damage formula and weapon detail note
}

/** Returns an array of objects that contains the information for each weapon */
function weaponInfo() {
	const melee = "melee", ranged = "ranged", ammunition = "Ammunition", finesse = "Finesse", heavy = "Heavy",
		light = "Light", loading = "Loading", range = (nor: number, long: number) => `Range (${nor}/${long})` as const, reach = "Reach",
		thrown = (nor: number, long: number) => `Thrown (${nor}/${long})` as const, twoHanded = "Two-Handed",
		versatile = (d: number) => `Versatile (1d${d})` as const,
		special = <S extends string>(a: S): S extends SpecialWeapons ? `Special\n\n${string}` : "" => {
			const l = `Special\n\nYou have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.`
			const n = `Special\n\nA Large or smaller creature hit by a net is Restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.`
			switch (a) {
				case "lance":
					return l as ReturnType<typeof special>
				case "net":
					return n as ReturnType<typeof special>
				default:
					return "" as ReturnType<typeof special>
			}
		}
	// ^This series of const declarations was made for convenience during manual input of all the info below
	const weapon = [ // this is the array of weapon objects
		new Weapon("club", "1d4 bludgeoning", melee, light),
		new Weapon("dagger", "1d4 piercing", melee, finesse, light, thrown(20, 60)),
		new Weapon("greatclub", "1d8 bludgeoning", melee, twoHanded),
		new Weapon("handaxe", "1d6 slashing", melee, light, thrown(20, 60)),
		new Weapon("javelin", "1d6 piercing", melee, thrown(20, 60)),
		new Weapon("light hammer", "1d4 bludgeoning", melee, light, thrown(20, 60)),
		new Weapon("mace", "1d6 bludgeoning", melee, "-"),
		new Weapon("quarterstaff", "1d6 bludgeoning", melee, versatile(8)),
		new Weapon("sickle", "1d4 slashing", melee, light),
		new Weapon("spear", "1d6 piercing", melee, thrown(20, 60), versatile(8)),
		new Weapon("light crossbow", "1d8 piercing", ranged, ammunition, range(80, 320), loading, twoHanded),
		new Weapon("dart", "1d4 piercing", ranged, finesse, thrown(20, 60)),
		new Weapon("shortbow", "1d6 piercing", ranged, ammunition, range(80, 320), twoHanded),
		new Weapon("sling", "1d4 bludgeoning", ranged, ammunition, range(30, 120)),
		new Weapon("battleaxe", "1d8 slashing", melee, versatile(10)),
		new Weapon("flail", "1d8 bludgeoning", melee, "-"),
		new Weapon("glaive", "1d10 slashing", melee, heavy, reach, twoHanded),
		new Weapon("greataxe", "1d12 slashing", melee, heavy, twoHanded),
		new Weapon("greatsword", "2d6 slashing", melee, heavy, twoHanded),
		new Weapon("halberd", "1d10 slashing", melee, heavy, reach, twoHanded),
		new Weapon("lance", "1d12 piercing", melee, reach, special("lance")),
		new Weapon("longsword", "1d8 slashing", melee, versatile(10)),
		new Weapon("maul", "2d6 bludgeoning", melee, heavy, twoHanded),
		new Weapon("morningstar", "1d8 piercing", melee, "-"),
		new Weapon("pike", "1d10 piercing", melee, heavy, reach, twoHanded),
		new Weapon("rapier", "1d8 piercing", melee, finesse),
		new Weapon("scimitar", "1d6 slashing", melee, finesse, light),
		new Weapon("shortsword", "1d6 piercing", melee, finesse, light),
		new Weapon("trident", "1d6 piercing", melee, thrown(20, 60), versatile(8)),
		new Weapon("war pick", "1d8 piercing", melee, "-"),
		new Weapon("warhammer", "1d8 bludgeoning", melee, versatile(10)),
		new Weapon("whip", "1d4 slashing", melee, finesse, reach),
		new Weapon("blowgun", "1 piercing", ranged, ammunition, range(25, 100), loading),
		new Weapon("hand crossbow", "1d6 piercing", ranged, ammunition, range(30, 120), light, loading),
		new Weapon("heavy crossbow", "1d10 piercing", ranged, ammunition, range(100, 400), heavy, loading, twoHanded),
		new Weapon("longbow", "1d8 piercing", ranged, ammunition, range(150, 600), heavy, twoHanded),
		new Weapon("net", "-", ranged, thrown(5, 15), special("net")),
		new Weapon("yklwa", "1d8 piercing", melee, thrown(10, 30)),
		new Weapon("boomerang", "1d4 bludgeoning", ranged, range(60, 120)),
		new Weapon("unarmed strike", "1 bludgeoning", melee, "-")
	]
	return weapon
}