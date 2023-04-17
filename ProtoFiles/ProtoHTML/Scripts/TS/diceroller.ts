import { runGoogle, runGoogleWithReturn, ID, qry, qryA, capitalizer, Button, Input, Select, Div } from "../../../Master/JS"

qryA('input').forEach(x => x.autocomplete = 'off') // disable autocomplete for inputs
const grandTotal = { totals: [0], get final() { return (<number[]>this.totals).reduce((t, c) => t + c, 0) } } as { totals: number[], readonly final: number }
// ^create grandTotal object for misc dice
const dice = Array.from(qryA('#diceholder div div.die')), // create an array for each die type
	d20s = Array.from(qryA('.d20'))
dice.forEach(die => die.onclick = () => { runSubAnimation(die, true) }) // add an onclick function for each die
const pages = ["Saving Throw", "Skill Check", "Check Builder", "Misc Dice"] // array containing the page names for each type
var stats = {
	strSave: 0, dexSave: 0, conSave: 0, intSave: 0, wisSave: 0, chaSave: 0,
	acrobaticsCheck: 0, animalCheck: 0, arcanaCheck: 0, athleticsCheck: 0,
	deceptionCheck: 0, historyCheck: 0, insightCheck: 0, intimidationCheck: 0,
	investigationCheck: 0, medicineCheck: 0, natureCheck: 0, perceptionCheck: 0,
	performanceCheck: 0, persuasionCheck: 0, religionCheck: 0, sleightCheck: 0,
	stealthCheck: 0, survivalCheck: 0, strCheck: 0, init: 0,
	dexCheck: 0, conCheck: 0, intCheck: 0, wisCheck: 0, chaCheck: 0, prof: 0
}
var rolling = false

document.addEventListener('DOMContentLoaded', async () => { // on DOM Content Loaded
	try { await (async () => stats = await runGoogleWithReturn('getStats'))() } catch { } // try to get the stats from the sheet
	pages.forEach(p => { // loop through each page
		var pg: "st" | "sc" | "cb" | "md"
		switch (p) {
			case "Saving Throw":
				pg = 'st'
				break
			case "Skill Check":
				pg = 'sc'
				break
			case "Check Builder":
				pg = 'cb'
				break
			case "Misc Dice":
				pg = 'md'
				break
		}
		function _a<T>(o: T): asserts o is NonNullable<T> {}
		_a(pg!)

		const d20 = ID(`d20${pg}`)
		const arr = [d20, ...Array.from(qryA(`.${pg}button, .widebutton`))] as (HTMLDivElement | HTMLButtonElement)[]
		if (pg != 'md') arr.forEach(n => clicker(n, pg as Exclude<typeof pg, "md">, d20))
	})
	qryA('.d20 .randomnumber').forEach((holder: SVGSVGElement) => holder.dataset.initialclass = holder.className.baseVal)

	// Get the element with id="defaultOpen" and click on it
	ID("defaultOpen").click()
})
const newObj = {}
qryA('.storage div span').forEach(x => newObj[x.id] = Number(x.innerHTML))
console.log(JSON.stringify(newObj))

function pageTurner(evt: Event, page: string) {
	const curPage = qry('.tabcontent:not([style*="display:none"],[style*="display: none"])')
	switch (curPage.id) {
		case 'Saving Throw':
		case 'Skill Check':
		case 'Check Builder':
			qry('.totalindicator', curPage).innerHTML = 'Total: 0'
			qry('.randomnumber text', curPage).innerHTML = ''
			break
		case 'Misc Dice':
			ID<Input>('miscmodifier').value = String(0)
			ID('grandtotal').innerHTML = 'Total: 0'
			Array.from(ID('diceholder').children).forEach(child => {

				qry('.die svg text', child).innerHTML = '' // clear number in svg circle
				qry('.dieinputcontainer input', child).value = String(0)// reset number of dice to 0
				qry('.dicerolls', child).innerHTML = 'Rolled:'
				qry('.dicetotals', child).innerHTML = 'Total:'
			})
			dice.forEach(die => {
				var els = Array.from(qryA('svg polygon,polyline', die)) as SVGElement[]
				if (die.id == 'd12') els.push(ID<SVGElement>('d12a'))
				els.forEach(x => x.classList.remove(x.id))
			})
			break
	}
	const tabcontent = Array.from(document.getElementsByClassName("tabcontent")) as HTMLDivElement[]
	for (let x of tabcontent) x.style.display = "none"
	const tablinks = Array.from(document.getElementsByClassName("tablinks")) as HTMLButtonElement[]
	for (let x of tablinks) x.classList.toggle('active', false)
	ID(page).style.display = "block"
	{
		(<HTMLButtonElement>evt.currentTarget).classList.toggle('active', true)
	}
	const d20id = page.split(' ').map(x => x[0]).join('')
	d20s.forEach(d20 => {
		const holder = ID(`rnholder${d20.id.slice(-2)}`), classes = [...Array.from(holder.classList.values())]
		holder.classList.remove(...classes)
		holder.classList.add(holder.dataset.initialclass!)
		Array.from(d20.children).forEach(child => child.classList.toggle(child.id, false))
	})
	dice
	rolling = false
}

function clicker(n: HTMLElement, pg: "st" | "sc" | "cb", d20: HTMLElement) {
	if (n != null) n.onclick = () => runAnimation()
	function runAnimation() {
		if (rolling) return // guard clause that prevents rolling while a roll is taking place
		rolling = true
		const holder = ID(`rnholder${pg}`), // this is the random number holder
			checkSave = (['st', 'cb'].some(x => x == pg) && n.id.slice(0, 1) != 'd'
			) ? n.id.slice(1) : (pg == 'sc' && n.id != d20.id) ? `${ID<Select>('skill-checks').value}Check` : 'throw',
			modifier = stats[checkSave],
			dadv = qry(`input[name="dadv${pg}"]:checked`).value // advantage/disadvantage/normal roll
		console.log(checkSave, modifier)
		holder.classList.add('unloadnum')
		setTimeout(() => {
			ID(`randomnumber${pg}`).innerHTML = ''
			holder.style.visibility = 'hidden'
			holder.classList.remove('unloadnum')
		}, 975)
		var promiseResolve
		const proms = [...Array.from(d20.children).map((y: SVGElement) => new Promise<number>((res, rej) => {
			const clss = y.id
			const rndm1 = Math.floor(Math.random() * 20) + 1, rndm2 = Math.floor(Math.random() * 20) + 1,
				rndm = (dadv == 'adv') ? Math.max(rndm1, rndm2) : (dadv == 'dis') ? Math.min(rndm1, rndm2) :
					Math.floor(Math.random() * 20) + 1,
				rvalue = ID(`randomnumber${pg}`)
			if (clss == 'hex' || clss.includes('rnholder')) setTimeout(() => res(rndm), 4050)
			else y.classList.add(clss)
			y.onanimationend = () => {
				y.classList.remove(clss)
				switch (dadv) {
					case 'na':
						rvalue.innerHTML = String(rndm)
						break
					case 'dis':
					case 'adv':
						rvalue.innerHTML = `${rndm1}/${rndm2}`
						break
				}
				res(rndm)
			}
		})), new Promise<number>((res) => promiseResolve = res)]
		Promise.race(proms).then(a => {
			holder.classList.add('loadnum')
			holder.style.visibility = 'visible'
			holder.onanimationend = () => promiseResolve()
		})
		Promise.all(proms).then(arr => {
			holder.classList.remove('loadnum')
			const rndm = arr[arr.length - 3],
				total = Number(ID<Input>(`inputmodifier${pg}`).value),
				prof = Number(ID('prof').innerHTML),
				addProf = pg == 'cb' && ID<Input>('addprof').checked,
				abmod = `${rndm}${(modifier > 0) ? '+' : ''}${(modifier != 0) ? modifier : ''}${addProf ? `+${prof}` : ''}` +
					`${(total > 0) ? '+' : ''}${(total != 0) ? total : ''}`
			ID(`total${pg}`).innerHTML = `Total: ${abmod}` + (['-', '+'].some(x => abmod.includes(x)) ?
				`=${total + rndm + modifier + (addProf ? prof : 0)}` : '')
			rolling = false
		})
	}
}

/** @param {HTMLElement|Element} die */
function runSubAnimation(die: HTMLElement | Element, click = false) {
	return new Promise<void>((res) => {
		const dx = parseInt(die.id.slice(1))
		const holder = ID(`rnholderd${dx}`)
		holder.classList.add('unloadnum')
		setTimeout(() => {
			ID(`randomnumberd${dx}`).innerHTML = ''
			holder.style.visibility = 'hidden'
			holder.classList.remove('unloadnum')
			ID(`d${dx}rolls`).innerHTML = 'Rolled: '
			ID(`d${dx}total`).innerHTML = 'Total: '
		}, 975)
		var els = Array.from(qryA('svg polygon,polyline', die)) as SVGElement[]
		if (die.id == 'd12') els.push(ID('d12a') as unknown as SVGElement)
		const bool = [4, 6].some(x => dx == x)
		els.forEach(poly => {
			poly.classList.add(poly.id)
			poly.onanimationend = () => {
				poly.classList.remove(poly.id)
				const rndm = Math.floor(Math.random() * dx) + 1
				const rvalue = ID(`randomnumberd${dx}`)
				rvalue.innerHTML = String(rndm)
				holder.classList.add(`loadnum${dx == 6 ? '1' : ''}`)
				const interval = !bool ?
					setInterval(() => { rvalue.innerHTML = String(Math.floor(Math.random() * dx) + 1) }, 200) : 0
				holder.style.visibility = 'visible'
				holder.onanimationend = () => {
					holder.classList.remove(`loadnum${dx == 6 ? '1' : ''}`)
					if (bool) update()
				}
				if (interval) setTimeout(() => {
					clearInterval(interval)
					update()
				}, 1000)
			}
		})
		function update() {
			const numdice = Number(ID<Input>(`numd${dx}`).value),
				rollsElem = ID(`d${dx}rolls`),
				totalElem = ID(`d${dx}total`),
				rnum = Number(ID(`randomnumberd${dx}`).innerHTML),
				rolls = [rnum]
			if (numdice == 1 && !click) {
				rollsElem.innerHTML = `Rolled: ${rnum}`
				totalElem.innerHTML = `Total: ${rnum}`
			} else if (numdice > 1 && !click) {
				for (let i = 1; i < numdice; i++) rolls.push(Math.floor(Math.random() * dx) + 1)
				const total = rolls.reduce((tot, cur) => tot + cur, 0)
				rollsElem.innerHTML = `Rolled: ${rolls.join(', ')}`
				totalElem.innerHTML = `Total: ${total}`
			}
			res()
		}
	})
}

function multiroller() {
	grandTotal.totals = [0]
	const dx = [4, 6, 8, 10, 12]
	const /** @type {HTMLElement[]} */ dns: HTMLElement[] = [], /** @type {HTMLElement[]} */ other: HTMLElement[] = []
	for (let x of dx) (Number(ID<Input>(`numd${x}`).value) > 0 ? dns : other).push(ID(`d${x}`))
	if (other.length) resetMiscDice(other.map(x => Number(x.id.slice(1))), false)
	if (dns.length > 0) {
		const proms = dns.map(f => runSubAnimation(f))
		Promise.all(proms).then(() => {
			for (let j of dx) grandTotal.totals.push(Number(ID(`d${j}total`).innerHTML.slice(7)))
			const miscMod = Number(ID<Input>('miscmodifier').value),
				grand = ID('grandtotal')
			if (dns.length > 1) {
				grand.innerHTML = `Total: ${grandTotal.totals.filter(x => x).join('+')}` +
					(miscMod != 0 ? `${miscMod > 0 ? '+' : ''}${miscMod}` : '') +
					`=${grandTotal.final + miscMod}`
			} else grand.innerHTML = `Total: ${grandTotal.final}`
		})
	}
}

function resetMiscDice(arr = [4, 6, 8, 10, 12], io = true) {
	arr.forEach(d => {
		ID<Input>(`numd${d}`).value = String(0)
		ID(`d${d}rolls`).innerHTML = 'Rolled: 0'
		ID(`d${d}total`).innerHTML = 'Total: 0'
		reset(ID(`d${d}`))
	})
	if (io) {
		ID<Input>('miscmodifier').value = String(0)
		ID('grandtotal').innerHTML = 'Total: 0'
	}
}

/** @param {HTMLElement} other */
function reset(other: HTMLElement) {
	const dx = Number(other.id.slice(1)),
		holder = ID(`rnholderd${dx}`)
	holder.classList.add('unloadnum')
	holder.onanimationend = () => {
		ID(`randomnumberd${dx}`).innerHTML = ''
		holder.style.visibility = 'hidden'
		holder.classList.remove('unloadnum')
		holder.onanimationend = () => { }
	}
}