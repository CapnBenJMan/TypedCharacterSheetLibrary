import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

document.addEventListener("DOMContentLoaded", () => { // on DOM Content Loaded
	const height = ID('preface').clientHeight // get the height of the preface text
	ID('formulas').style.height = `calc(100% - ${height + 1}px)` // set the height of the formulas div
	const data = getData() // every prewritten formula for each class
	data.forEach(x => x.features.sort((a, b) => {
		const nameA = a.name.toUpperCase() // ignore upper and lowercase
		const nameB = b.name.toUpperCase() // ^^^
		if (nameA < nameB) return -1
		if (nameA > nameB) return 1
		return 0
	}))
	const output = data.reduce((tot, cur) => tot + `\n<tr><th colspan="2">
			<table class="subtable" width="100%">
				<colgroup span="1" width="30%" style="border-right: 1px solid #eee"></colgroup>
				<tr><th colspan="2">${cur.class}</th></tr>
				<tr><th>Feature Name</th><th>Formula</th></tr>
			</table>
		</th></tr>` + cur.features.reduce((tot1, cur1) => tot1 + `\n<tr><td onclick="copier(this)">${cur1.name}</td>
		<td onclick="copier(this)">${cur1.formula}</td></tr>`, ''),
		'<colgroup span="1" width="30%" style="border-right: 1px solid #eee"></colgroup>')
	// ^reduce through data to generate innerHTML for prelist table
	ID('prelist').innerHTML = output // apply output to prelist innerhtml
})

async function copier(e: Element) {
	const formula = (e.nextElementSibling == null ?
		e.innerHTML : e.nextElementSibling.innerHTML) // makes sure that the element containing the formula is the one being used
		.replace(/(?<=\&)amp;/g, '')
		.replace(/&\w+?;/g, m => { // replace all incorrect symbols
			const stuff = {
				"&lt;": "<",
				"&gt;": ">",
				"&amp;": "&"
			}
			return m in stuff ? stuff[m] : m
		})
	await navigator.clipboard.writeText(formula) // copy formula to clipboard
	alert(`Copied '${formula}' to clipboard`) // alert user of copy
}

function getData() { // returns the features and their formulas for each class
	return [
		{
			class: 'Artificer', features: [
				{ name: 'Infusions Known', formula: `="Infusions Known: "&CHOOSE(ArtificerLvl, "-",4,4,4,4,6,6,6,6,8,8,8,8,10,10,10,10,12,12,12)` },
				{ name: 'Infused Items', formula: `="Infused Items: "&CHOOSE(ArtificerLvl, "-",2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6)` },
			]
		},
		{
			class: 'Barbarian', features: [
				{ name: 'Rage Damage', formula: `="Rage Damage: "&IFS(BarbarianLvl<9,"+2", BarbarianLvl<16,"+3", BarbarianLvl>=16,"+4")` },
				{ name: 'Rage Uses', formula: `="Rages: "&IFS(BarbarianLvl<3,2, BarbarianLvl<6,3, BarbarianLvl<12,4, BarbarianLvl<17,5, BarbarianLvl<20,6, BarbarianLvl=20,"Unlimited")` },
				{ name: 'Brutal Critical', formula: `="Brutal Critical: "&IFS(BarbarianLvl<9, 0, BarbarianLvl<13,1, BarbarianLvl<17,2, BarbarianLvl>=17,3)` }
			]
		},
		{
			class: 'Bard', features: [
				{ name: 'Bardic Inspiration', formula: `="Bardic Inspiration: "&JOIN("d", N(Cha), CHOOSE(BardLvl, 6,6,6,6,8,8,8,8,8,10,10,10,10,10,12,12,12,12,12,12))` },
				{ name: 'Song of Rest', formula: `="Song of Rest: "&JOIN("d", "1", CHOOSE(BardLvl, "",6,6,6,6,6,6,6,8,8,8,8,10,10,10,10,12,12,12,12))` }
			]
		},
		{
			class: 'Cleric', features: [
				{ name: 'Channel Divinity', formula: `="Channel Divinity Uses: "&CHOOSE(ClericLvl, "",1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3)` },
				{ name: 'Destroy Undead', formula: `="Destroy Undead CR: "&CHOOSE(ClericLvl, "","","","","1/2","1/2","1/2",1,1,1,2,2,2,3,3,3,4,4,4,4)` },
				{ name: 'Divine Intervention', formula: `="Divine Intervention: "&IFS(ClericLvl<10,0, ClericLvl=20,"100%", TRUE,ClericLvl&"%")` }
			]
		},
		{
			class: 'Druid', features: [
				{ name: 'Wild Shape CR', formula: `="Wild Shape CR: "&IFS(DruidLvl=1,"", DruidLvl<4,"1/4", DruidLvl<8,"1/2", TRUE,1)` },
				{ name: 'Wild Shape CR (Circle of the Moon)', formula: `="Wild Shape CR: "&IFS(DruidLvl=1,"", DruidLvl<6,1, TRUE,ROUNDDOWN(DruidLvl/3))` }
			]
		},
		{
			class: 'Fighter', features: [
				{ name: 'Action Surge', formula: `="Action Surge Uses: "&IFS(FighterLvl=1,0, FighterLvl>=17,2, TRUE,1)` },
				{ name: 'Extra Attack', formula: `="Extra Attacks: "&IFS(FighterLvl<5,0, FighterLvl<11,1, FighterLvl<20,2, FighterLvl=20,4)` },
				{ name: 'Indomitable', formula: `="Indomitable Uses: "&IFS(FighterLvl<9,0, FighterLvl<13,1, FighterLvl<17,2, FighterLvl>=17,3)` },
				{ name: 'Second Wind', formula: `="Second Wind: 1d10+"&FighterLvl` }
			]
		},
		{
			class: 'Monk', features: [
				{ name: 'Martial Arts', formula: `="Martial Arts: "&VLOOKUP(MonkLvl,AR28:AS47,2,1)` },
				{ name: 'Ki Points', formula: `="Ki Points: "&IF(MonkLvl>=2, MonkLvl, "")` },
				{ name: 'Unarmored Movement', formula: `="Unarmored Movement: "&CHOOSE(MonkLvl, "",10,10,10,10,15,15,15,15,20,20,20,20,25,25,25,25,30,30,30)` },
				{ name: 'Ki DC', formula: `="Ki DC: "&IF(MonkLvl>=2, 8+Prof+Wis, "")` },
				{ name: 'Deflect Missiles', formula: `="Deflect Missiles: "&IF(MonkLvl>=3, "1d10+"&Dex+MonkLvl, "")` },
				{ name: 'Slow Fall', formula: `="Slow Fall Reduction: "&IF(MonkLvl>=4, 5*MonkLvl, "")` }
			]
		},
		{
			class: 'Paladin', features: [
				{ name: 'Divine Sense', formula: `="Divine Sense Uses: "&1+Cha` },
				{ name: 'Lay on Hands', formula: `="Lay on Hands: "&5*PaladinLvl` },
				{ name: 'Aura of Protection', formula: `="Aura of Protection: "&MAX(Cha,1)` },
				{ name: 'Cleansing Touch', formula: `="Cleansing Touch Uses: "&MAX(Cha,1)` }
			]
		},
		{
			class: 'Ranger', features: [
				{ name: 'Favored Foe Damage', formula: `="Favored Foe Damage: 1d"&IFS(RangerLvl<6,4, RangerLvl<14,6, RangerLvl>=14,8)` },
				{ name: 'Favored Foe Uses', formula: `="Favored Foe Uses: "&Prof` },
				{ name: 'Nature\'s Veil Uses', formula: `="Nature's Veil Uses: "&Prof` },
			]
		},
		{
			class: 'Rogue', features: [
				{ name: 'Sneak Attack', formula: `="Sneak Attack: "&ROUNDUP(RogueLvl/2)&"d6"` },
				{ name: 'Psionic Energy Dice (Soulknife)', formula: `="Psi. Energy Dice: "&2*Prof&"d"&IFS(RogueLvl<3,"", RogueLvl<5,6, RogueLvl<11,8, RogueLvl<17,10, RogueLvl>=17,12)` }
			]
		},
		{
			class: 'Sorcerer', features: [
				{ name: 'Sorcery Points', formula: `="Sorcery Points: "&IF(SorcererLvl>=2, SorcererLvl, "")` },
				{ name: 'Restore Balance (Clockwork Soul)', formula: `="Restore Balance Uses: "&Prof` }
			]
		},
		{
			class: 'Warlock', features: [
				{ name: 'Invocations Known', formula: `="Invocations Known: "&CHOOSE(WarlockLvl, "",2,2,2,3,3,4,4,5,5,5,6,6,6,7,7,7,8,8,8)` },
				{ name: 'Pact of the Talisman Uses', formula: `="Talisman Uses: "&IF(WarlockLvl>=3, Prof, "")` }
			]
		},
		{
			class: 'Wizard', features: [
				{ name: 'Arcane Recovery', formula: `="Arcane Recovery: "&ROUNDUP(WizardLvl/2)` },
				{ name: 'Arcane Ward (School of Abjuration)', formula: `="Arcane Ward HP: "&(WizardLvl*2+Int)` }
			]
		}
	]
}