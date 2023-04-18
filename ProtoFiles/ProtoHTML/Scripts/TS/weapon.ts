import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

qryA('input').forEach(x => x.autocomplete = 'off')

const weapons = ID<Select>('weapons') // defines reference to type element and its options

async function submission() { // runs on pressing the confirm button
	ID('loader').style.visibility = 'visible' // set loader to visible
	const props = [...((ID<Input>('customprops').value !== '') ?
		String(ID<Input>('customprops').value).split(/(?<!\() *, *(?![\w\s]*\))/g)
		: ['-']), (ID('custompropsExt').innerHTML !== '') ? `Additional Info:\n\n${ID('custompropsExt').innerHTML}` : '']
		.filter(x => x !== ''),
		custom = {
			name: capitalizer(ID<Input>('customname').value),
			damage: `${ID<Input>('customdmgNum').value}d${ID<Select>('customdmgDie').value} ${ID<Select>('customdmgType').value}`,
			props,
			type: ID<Select>('customtype').value
		} as Parameters<typeof CharacterSheetCode.weaponSetter>[4]
	await runGoogle("weaponSetter", [
		weapons.value,
		ID<Input>('proficient').checked,
		ID<Input>('same').checked,
		{
			bonus: Number(ID<Input>('samebonus').value),
			attBonus: Number(ID<Input>('attackbonus').value),
			damBonus: Number(ID<Input>('damagebonus').value)
		},
		custom,
		{
			bool: ID<Input>('overridebool').checked,
			val: ID<Select>('overrideval').value as CharacterSheetCode.ShortCharStats,
			mw: ID<Input>('ismonkweapon').checked
		}
	])
	google.script.host.close()
}

document.addEventListener("DOMContentLoaded", async () => {
	const array = await runGoogleWithReturn('weaponInfo')
	var options = array.map(x => capitalizer(x.name))
	for (let a of options) {
		var el = document.createElement("option")
		el.textContent = a
		el.value = a
		weapons.appendChild(el)
	}
})

const same = ID<Input>("same"),
	ddiv = ID("differentdiv")
same.onclick = () => {
	if (same.checked) {
		ddiv.style.visibility = 'visible'
		ddiv.style.position = 'initial'
	} else {
		ddiv.style.visibility = 'hidden'
		ddiv.style.position = 'absolute'
	}
}

/** @param {boolean} bool */
function toggleWeaponProps(bool) {
	ID('propspan').classList.toggle('magic', bool)
	ID('propback').classList.toggle('magic', bool)
}

function changer() {
	const custom = ID('custom')
	if (ID<Select>('weapons').value === 'Custom') custom.classList.toggle('magic', false)
	else custom.classList.toggle('magic', true)
}

ID('overridebool').onchange = () => {
	if (ID<Input>('overridebool').checked) {
		ID('overridespan').className = ''
	} else {
		ID('overridespan').className = 'magic'
	}
}