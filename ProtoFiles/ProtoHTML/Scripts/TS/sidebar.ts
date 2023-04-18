import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer } from "../../../Master/JS_Template"
import type { Button, Div, Input, Select } from "../../../Master/JS_Template"

const svg = svgReturn()

qryA('input').forEach(x => x.autocomplete = 'off')
const loader = ID('loader') // define loader element
var maximum = 0
const HP = { cur: 0, temp: 0, bonus: 0, limit: 0, get max(): number { return maximum + this.temp + this.bonus } }
var spellsIsRunning = false

function reload() { // reload button code
	loader.classList.remove('magic') // shows loader
	runGoogle("sideBarLoader") // runs the sidebar loader
}
document.addEventListener('DOMContentLoaded', () => { // when the sidebar finishes loading
	getCurrent()
	setTimeout(() => {
		if (loader.style.visibility == 'visible') ID('errormessage').classList.remove('magic')
	}, 20000)
})
ID('errormessage').onclick = () => ID('errormessage').classList.add('magic')

async function getCurrent() { // get current values of health cells and update formatting to match
	try {
		loader.classList.remove('magic') // show loader while code is processing
		ID<Input>('ip').style.backgroundImage = "url('data:image/svg+xml;base64," + window.btoa(svg) + "')"
		qryA('button#SR, button#LR').forEach(x => x.style.width = `39%`)
		qryA('button#\\+LR, button#-LR').forEach((x: Button) => x.style.width = `${(80 / 300) * 100}%`)
		qryA('button#setSlots, button#spellReturn').forEach(x => x.style.width = `${(95 / 285) * 100}%`)
		qryA('button#bonushp, button#bhplimit').forEach(x => x.style.width = `42%`)
		const returnVal = await runGoogleWithReturn('getCurrent') // run code to return values of health cells
		HP.cur = Number(returnVal[0])
		maximum = Number(returnVal[1])
		HP.temp = Number(returnVal[2])
		HP.bonus = Number(returnVal[6])
		if (returnVal[3]) getSpells(returnVal[3]) // run get spells
		ID('version').innerHTML = returnVal[5]
		updateHealth()
		if (!spellsIsRunning) loader.classList.add('magic')
	} catch (err) { console.error(err) }
}

const toggles = qryA('.content .toggle input[type=checkbox]')

toggles.forEach(x => x.onchange = () => toggles.forEach(y => y.checked = x.checked))

qryA('#main button.dbutton').forEach(x => {
	// for each button, create an onmouseover, onmouseout, onmousedown, and onmouseup listener
	x.onmouseover = () => helptext('on', x.id) // onmouseover, turn on helptext
	x.onmouseout = () => helptext('off') // onmouseout, turn off helptext
	x.onmousedown = () => animationControl('pause') // onmousedown, pause scrolling helptext
	x.onmouseup = () => animationControl('resume') // onmouseup, unpause scrolling helptext
})
qryA('#tools button.dbutton').forEach(x => {
	// for each button, create an onmouseover, onmouseout, onmousedown, and onmouseup listener
	x.onmouseover = () => helptext1('on', x.id) // onmouseover, turn on helptext
	x.onmouseout = () => helptext1('off') // onmouseout, turn off helptext
	x.onmousedown = () => animationControl('pause') // onmousedown, pause scrolling helptext
	x.onmouseup = () => animationControl('resume') // onmouseup, unpause scrolling helptext
})
qryA('.content div.toggle').forEach(toggle => {
	var tip = toggle.children.namedItem('tip')! // define reference to tiptext
	toggle.onmouseover = () => {
		tip.innerHTML = `Tip: You can hold down a button to pause any scrolling 
	      text for ease of reading. If you don't want the button to activate, make sure to release off of the button.` }
	// onmouseover for toggle button, show tiptext
	toggle.onmouseout = () => tip.innerHTML = ''  // onmouseout, hide tiptext
})

async function updateHealth() {
	// This is where the references are defined
	const hpbar = ID('hpbar'),
		bhpbar = ID('bhpbar'),
		thpbar = ID('thpbar'),
		healthText = ID('healthtext')
	// This section sets the width of the bars
	hpbar.style.width = `${(HP.cur / HP.max) * 100}%`
	bhpbar.style.width = `${(HP.bonus / HP.max) * 100}%`
	thpbar.style.width = `${(HP.temp / HP.max) * 100}%`
	// This is where the color of the bars are set
	const hpcolor = colorArray((HP.cur / maximum) * 100),
		bhpcolor = colorArrayB((HP.bonus / HP.max) * 100)
	hpbar.style.backgroundColor = `rgb(${hpcolor[0]}, ${hpcolor[1]}, 0)`
	bhpbar.style.backgroundColor = `rgb(${bhpcolor[0]}, ${bhpcolor[1]}, 255)`
	// This is where the corners of the bars are set
	if (HP.temp == 0 && HP.bonus == 0) hpbar.style.borderRadius = '10px 10px 10px 10px'
	else hpbar.style.borderRadius = '10px 0px 0px 10px'
	if (HP.temp > 0) bhpbar.style.borderRadius = '0px 0px 0px 0px'
	else bhpbar.style.borderRadius = '0px 10px 10px 0px'
	// This is where the Current Health text is set
	const cur = `${HP.cur}${HP.bonus > 0 ? `+${HP.bonus}` : ''}${HP.temp > 0 ? `+${HP.temp}` : ''}`
	const max = `${maximum}${HP.bonus > 0 ? `+${HP.bonus}` : ''}${HP.temp > 0 ? `+${HP.temp}` : ''}`
	healthText.innerHTML = `Current Health: ${cur}/${max}`
	healthText.style.fontSize = '16px'
	for (let i = 16; getComputedStyle(qry('.back')).height <= getComputedStyle(qry('.healthtext')).height; i -= 0.01) healthText.style.fontSize = `${i}px`
}

async function health(button: string) {
	const nue = [null, undefined, '']
	// if input is not null, undefined, or an empty string and if input is greater than 0
	if (nue.every(x => x != ID<Input>('ip').value) && Number(ID<Input>('ip').value) > 0) {
		var input = parseInt(ID<Input>('ip').value)
		switch (button) {
			case 'damage': {
				var damage = input
				if (HP.temp > 0) {
					if (damage > HP.temp) {
						damage -= HP.temp
						HP.temp = 0
					} else {
						HP.temp -= damage
						damage = 0
					}
				}
				if (HP.bonus > 0) {
					if (damage > HP.bonus) {
						damage -= HP.bonus
						HP.bonus = 0
						HP.limit = 0
					} else {
						HP.bonus -= damage
						damage = 0
					}
				}
				if (HP.cur > 0) {
					if (damage > HP.cur) {
						damage -= HP.cur
						HP.cur = 0
					} else {
						HP.cur -= damage
						damage = 0
					}
				}
				break
			}
			case 'heal':
				HP.cur = Math.min(maximum, HP.cur + input)
				break
			case 'temphp':
				HP.temp = input
				break
			case 'bheal':
				if (HP.limit > 0) HP.bonus = Math.min(HP.limit, HP.bonus + input)
				else HP.bonus += input
				break
		}
		try { runGoogle("health", [HP]) } catch { }
		ID<Input>('ip').value = ''
		updateHealth()
	}
}

type Spellcast = Button & { readonly: boolean }

async function longRest() {
	loader.classList.remove('magic') // set loader to visible while processing
	ID<Spellcast>('spellcast').readonly = true
	await runGoogle('longRest') // run long rest code
	getCurrent() // run getCurrent
}

async function shortRest() {
	loader.classList.remove('magic') // set loader to visible while processing
	ID<Spellcast>('spellcast').readonly = true
	await runGoogle('shortRest') // run short rest code
	getCurrent() // run getCurrent
}

async function addLongRest() {
	loader.classList.remove('magic') // set loader to visible while processing
	await runGoogle('addLongRest') // run add rest code
	loader.classList.add('magic') // set loader to hidden as processing ends
}

async function removeLongRest() {
	loader.classList.remove('magic') // set loader to visible while processing
	await runGoogle('removeLongRest') // run remove rest code
	loader.classList.add('magic') // set loader to hidden as processing ends
}

function helptext(ioBool: "off"): void
function helptext(ioBool: "on", buttonType: string): void
function helptext(ioBool: "on" | "off", buttonType?: string): void { // input/output Boolean, button id
	if (ID<Input>('togglehelp').checked == true) { // if enable helptext is checked
		const infoRepository = {
			'dmg': 'Enter a value in the input box and press this button to have the program calculate damage.',
			'heal': 'Enter a value in the input box and press this button to have the program calculate healing.',
			'temphp': 'Enter a value in the input box and press this button to have the program add TempHP.<br>NOTE: TempHP is not cumulative, and this program will not add to the previous TempHP value.',
			'reload': `Use this button to refresh the HTML content of this sidebar in case it isn't working properly.`,
			'LR': 'Use this button when you take a long rest. It will automatically reset your health, tempHP, spells, and any other value set with the +Rest button.',
			'SR': 'Use this button when you take a short rest. It will automatically ask you if you rolled hit dice, the total rolled, and reset any value set with the +Rest button.',
			'+LR': 'Use this button to apply a rest rule to a cell or modify an existing rule.',
			'-LR': 'Use this button to remove a rest rule from a cell.',
			'diceroll': 'Use this button to perform a dice roll.',
			'level': 'Use this button to add or edit a level in a class.',
			'spellcast': 'Use this button to use your spell slots or edit how many you have of each.',
			'btools': 'Use this button to access a couple of tools, such as a coin calculator or converter, a formula generator, and more.',
			'bonushp': 'Enter a value in the input box and press this button to have the program calculate BonusHP for things like Wild Shape Health, Abjuration Wizard\'s Arcane Ward, Polymorph Health, etc.',
			'bhplimit': 'Use this button to apply a limit to the amount of BonusHP the character can have. Enter 0 to remove the limit.'
		}
		const ht = ID('helptext'), // define reference to helptext div element
			toh = ID('textofhelp') // define reference to helptext paragraph element
		const textOfHelp = (ioBool == 'on') ? infoRepository[buttonType!] : '' // define paragraph content variable
		if (ioBool == 'on') { // if onmouseover was triggered
			toh.innerHTML = textOfHelp // set helptext to selected button helptext
			setTimeout(() => {
				if (parseFloat(getComputedStyle(ht).height) < parseFloat(getComputedStyle(toh).height)) // if helptext is greater than 115 in length
					toh.style.animation = 'scroll 5s linear 1s infinite alternate' // create scrolling animation
			}, 1)
			ht.classList.toggle('magic', false)
		} else if (ioBool == 'off') { // if onmouseout was triggered
			toh.innerHTML = '' // set helptext to empty string
			toh.style.animation = '' // end animation
			ht.classList.toggle('magic', true)
		}
	}
}


function helptext1(ioBool: "off"): void
function helptext1(ioBool: "on", buttonType: string): void
function helptext1(ioBool: "on" | "off", buttonType?: string): void { // input/output Boolean, button id
	if (ID<Input>('togglehelpT').checked == true) { // if enable helptext is checked
		const infoRepository = {
			'returnTools': 'Use this button to return to the main page.',
			'featurelookup': 'Use this button to search for a feature, feat, magic item, or spell.',
			'calculator': 'Use this button to manually calculate coin totals.',
			'distributor': 'Use this button to redistribute your coin totals.',
			'formulas': 'Use this button to open up a library that contains a series of formulas for the different class features.',
			'sethitdice': 'Use this button to override your current amount of hit dice.',
			'equipment': 'Use this button to copy a piece of equipment to the sheet.'
		}
		const ht = ID('helptextT'), // define reference to helptext div element
			toh = ID('textofhelpT') // define reference to helptext paragraph element
		const textOfHelp = (ioBool == 'on') ? infoRepository[buttonType!] : '' // define paragraph content variable
		if (ioBool == 'on') { // if onmouseover was triggered
			toh.innerHTML = textOfHelp // set helptext to selected button helptext
			setTimeout(() => {
				if (parseFloat(getComputedStyle(ht).height) < parseFloat(getComputedStyle(toh).height)) { // if helptext is greater than 115 in length
					toh.style.animation = 'scroll 5s linear 1s infinite alternate' // create scrolling animation
				}
			}, 1)
			ht.classList.toggle('magic', false)
		} else if (ioBool == 'off') { // if onmouseout was triggered
			toh.innerHTML = '' // set helptext to empty string
			toh.style.animation = '' // end animation
			ht.classList.toggle('magic', true)
		}
	}
}

function animationControl(a) {
	qryA('.content .toggle .helptext > p').forEach(help => {
		switch (a) { // switch between onmousedown and onmouseup to pause and unpause scrolling animation
			case 'pause':
				help.style.animationPlayState = 'paused'
				break
			case 'resume':
				help.style.animationPlayState = 'running'
				break
		}
	})
}

async function rollSomeDice() {
	loader.classList.remove('magic') // set loader to visible while processing
	await runGoogle('openHTML', ['diceroller']) // run dice roller code
	getCurrent() // run getCurrent
	loader.classList.add('magic') // set loader to hidden as processing ends
}

function addlevel() {
	loader.classList.remove('magic')
	runGoogle("openHTML", ['level'])
}

async function getSpells(bool = false) {
	spellsIsRunning = true
	if (bool) ID('spellcontainer').className = ''
	const slots = await runGoogleWithReturn('getSpells')
	for (let a of ['sc', 'pm']) {
		for (let i = 1; i <= 9; i++) {
			const cur = ID<Input>(`cur${a}${i}`)
			const use = ID<Button>(`use${a}${i}`)
			if ((slots.scLvl > 0 && a == 'sc') || (slots.pmLvl > 0 && a == 'pm')) {
				if (slots[`${a}${i}`] >= 0) {
					cur.value = slots[`${a}${i}`]
					cur.dataset.ignore = "false"
					cur.disabled = false
					use.disabled = false
				} else {
					cur.value = "0"
					cur.disabled = false
					cur.dataset.ignore = "true"
					use.disabled = true
				}
			} else {
				cur.disabled = true
				use.disabled = true
			}
		}
	}
	ID<Spellcast>('spellcast').readonly = false
	if (ID<Spellcast>('spellcast').classList.contains('grayout')) ID<Spellcast>('spellcast').classList.remove('grayout')
	loader.classList.add('magic')
	spellsIsRunning = false
}

function openSpells(n) {
	if (!n.readonly) {
		ID("main").classList.add('magic')
		ID("spells").classList.remove('magic')
	} else alert("Please allow the code a few seconds to process before trying again.")
}

function closeSpells() {
	ID("spells").classList.add('magic')
	ID("main").classList.remove('magic')
	ID<Spellcast>('spellcast').readonly = true
	ID<Spellcast>('spellcast').classList.add('grayout')
	getSpells()
}

function openTools() {
	ID("main").classList.add('magic')
	ID("tools").classList.remove('magic')
}

function closeTools() {
	ID("tools").classList.add('magic')
	ID("main").classList.remove('magic')
}

function useSlot(n, type) {
	const current = ID<Input>(`cur${type}${n}`)
	ID<Button>(`use${type}${n}`).disabled = true
	ID<Button>(`use${type}${n}`).classList.add('grayout')
	setTimeout(() => {
		ID<Button>(`use${type}${n}`).disabled = false
		ID<Button>(`use${type}${n}`).classList.remove('grayout')
	}, 3000)
	const cv = Number(current.value)
	if (current.value != "0") {
		current.value = String(cv - 1)
		runGoogle('useSpellSlot', [n, type])
	}
}

function setSlots() {
	const obj = {
		sc1: { dis: (Number(ID<Input>('cursc1').value) > 0 || ID<Input>('cursc1').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc1').value) },
		sc2: { dis: (Number(ID<Input>('cursc2').value) > 0 || ID<Input>('cursc2').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc2').value) },
		sc3: { dis: (Number(ID<Input>('cursc3').value) > 0 || ID<Input>('cursc3').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc3').value) },
		sc4: { dis: (Number(ID<Input>('cursc4').value) > 0 || ID<Input>('cursc4').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc4').value) },
		sc5: { dis: (Number(ID<Input>('cursc5').value) > 0 || ID<Input>('cursc5').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc5').value) },
		sc6: { dis: (Number(ID<Input>('cursc6').value) > 0 || ID<Input>('cursc6').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc6').value) },
		sc7: { dis: (Number(ID<Input>('cursc7').value) > 0 || ID<Input>('cursc7').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc7').value) },
		sc8: { dis: (Number(ID<Input>('cursc8').value) > 0 || ID<Input>('cursc8').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc8').value) },
		sc9: { dis: (Number(ID<Input>('cursc9').value) > 0 || ID<Input>('cursc9').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('cursc9').value) },
		pm1: { dis: (Number(ID<Input>('curpm1').value) > 0 || ID<Input>('curpm1').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm1').value) },
		pm2: { dis: (Number(ID<Input>('curpm2').value) > 0 || ID<Input>('curpm2').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm2').value) },
		pm3: { dis: (Number(ID<Input>('curpm3').value) > 0 || ID<Input>('curpm3').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm3').value) },
		pm4: { dis: (Number(ID<Input>('curpm4').value) > 0 || ID<Input>('curpm4').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm4').value) },
		pm5: { dis: (Number(ID<Input>('curpm5').value) > 0 || ID<Input>('curpm5').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm5').value) },
		pm6: { dis: (Number(ID<Input>('curpm6').value) > 0 || ID<Input>('curpm6').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm6').value) },
		pm7: { dis: (Number(ID<Input>('curpm7').value) > 0 || ID<Input>('curpm7').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm7').value) },
		pm8: { dis: (Number(ID<Input>('curpm8').value) > 0 || ID<Input>('curpm8').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm8').value) },
		pm9: { dis: (Number(ID<Input>('curpm9').value) > 0 || ID<Input>('curpm9').dataset.ignore == "false") ? true : false, val: Number(ID<Input>('curpm9').value) }
	}
	runGoogle('setSpellSlots', [obj])
}

function colorArray(percent) {
	percent = parseFloat(percent) // makes sure  percent is a number
	var red, green // defines a pair of variables to be assigned values later
	const redMax = 255 // sets the max for red
	const greenMax = 255 // sets the max for green
	if (percent > 50) { // if percent is greater than 50
		green = greenMax
		red = (100 - percent) * 2 * (redMax / 100) // red = (100-percent)*2 * (redMax/100)
	} else if (percent < 50) {
		red = redMax
		green = percent * 2 * (greenMax / 100) // green = (percent*2) * (greenMax/100)
	} else if (percent == 50) {
		red = redMax
		green = greenMax
	}
	return [parseInt(red.toFixed(0)), parseInt(green.toFixed(0))]
}

function colorArrayB(percent) {
	percent = parseFloat(percent) // makes sure  percent is a number
	var red, green // defines a pair of variables to be assigned values later
	const redMax = 255 // sets the max for red
	const greenMax = 255 // sets the max for green
	if (percent > 50) { // if percent is greater than 50
		green = (percent - 50) * 2 * 1.72 + 83 // red = (100-percent)*2 * (redMax/100)
		red = 83
	} else if (percent < 50) {
		red = -(percent - 50) * 2 * 1.72 + 83 // green = (percent*2) * (greenMax/100)
		green = 83
	} else if (percent == 50) {
		red = 83
		green = 83
	}
	return [parseInt(red.toFixed(0)), parseInt(green.toFixed(0))]
}

function limit() {
	var res
	while (true) {
		res = Number(prompt('Enter the upper limit of your bonus health.\nEnter 0 to remove that limit\n(No Decimals)'))
		if (Number.isNaN(res) || res.toString().includes('.')) alert('ERROR: You must enter an integer. Letters and decimals will be rejected.')
		else break
	}
	HP.limit = res
}

function svgReturn() {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 70">
		<style>
			path { fill: none; stroke: black; }
	
			/* @media (prefers-color-scheme: light) {
			path { stroke: black; }
			}
	
			@media (prefers-color-scheme: dark) {
			path { stroke: white; }
			} */
		</style>
		<g id="paths">
			<path d="
			M145,15
			l20,-10
			Q240,32.5 280,35
		" />
			<path d="
			M155,5
			Q192.5,30 230,5
			q20,10 20,30
		" />
			<path d="
			M145,5
			Q192.5,35 240,5
			q20,10 20,30
		" />
			<path d="
			M135,5
			Q192.5,40 250,5
			q20,10 20,30
		" />
		</g>
		<use href="#paths" transform="scale(-1,1)" transform-origin="145 35" />
		<use href="#paths" transform="scale(1,-1)" transform-origin="145 35" />
		<use href="#paths" transform="scale(-1,-1)" transform-origin="145 35" />
	</svg>
	`}