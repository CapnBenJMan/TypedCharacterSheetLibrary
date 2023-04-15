qryA('input').forEach(x => x.autocomplete = 'off'); // prevent text inputs from showing autocomplete suggestions
var armorOptions;
var str;
/** @param {string} x */
function selector(x) {
    const n = {
        baSelect: ID('armortypes'),
        baBonus: ID('armorbonus'),
        udSelect: ID('stats'),
        natSelect: ID('nataStats'),
        natBase: ID('natbase')
    }, warning1 = ID('warning1'), // this warning is for the strength requirement warning
    customarmor = ID('customarmor'); // this is the custom armor span
    const current = armorOptions.find(y => y.name.toLowerCase() == n.baSelect.value.toLowerCase()) ?? {}, requirement = ('strReq' in current && current.strReq != '-') ? Number(current.strReq.slice(4)) : 0; // define requirement as the strength requirement for the current armor
    switch (x) {
        case 'ba': // if base armor is selected
            for (let i in n) { // loop through n
                switch (i) {
                    case 'baSelect':
                    case 'baBonus':
                        n[i].disabled = false; // enable base armor selector and bonus input
                        break;
                    default:
                        n[i].disabled = true; // disable everything else
                        break;
                }
            }
            if (str < requirement)
                warning1.className = ""; // show warning1 if character's strength is too low
            else
                warning1.className = "magic"; // otherwise hide warning1
            break;
        case 'ud': // if unarmored defense is selected
            for (let i in n) { // loop through n
                switch (i) {
                    case 'udSelect':
                        n[i].disabled = false; // enable unarmored defense selector
                        break;
                    default:
                        n[i].disabled = true; // disable everything else
                        break;
                }
            }
            warning1.className = "magic"; // hide warning1
            break;
        case 'nata': // if natural armor is selected
            for (let i in n) { // loop through n
                switch (i) {
                    case 'natSelect':
                    case 'natBase':
                        n[i].disabled = false; // enable natural armor selector and base input
                        break;
                    default:
                        n[i].disabled = true; // disable everything else
                        break;
                }
            }
            warning1.className = "magic"; // hide warning1
            break;
        case 'na': // if no armor is selected
            for (let i in n)
                n[i].disabled = true; // disable everything
            warning1.className = "magic"; // hide warning1
            break;
    }
    customarmor.childNodes.forEach((y) => y.disabled = !(x == 'ba')); // disable each child element if base armor is not selected
    const customName = ID("customname");
    if (x === 'ba' && n.baSelect.value === 'Custom')
        customName.required = true; // if custom base armor is selected, make the name required
    else
        customName.required = false; // otherwise make the name not required
}
function viewer() {
    const shield = ID('shield'), // define reference to shield
    shieldBonus = ID('shieldbonus'), // define reference to shield bonus
    ud = ID('ud'), // define reference to unarmored defense
    warning = ID('warning'); // define reference to unarmored defense shield warning
    if (shield.checked) { // if shield is selected
        shieldBonus.disabled = false; // enable shield bonus input
        if (ud.checked)
            warning.className = ""; // if unarmored defense is checked, show warning
        else
            warning.className = "magic"; // otherwise hide warning
    }
    else { // otherwise
        shieldBonus.disabled = true; // disable shield bonus
        warning.className = 'magic'; // hide warning
    }
}
const armor = ID('armortypes'); // defines reference to type element and its options
async function submission() {
    event.preventDefault();
    ID('loader').style.visibility = 'visible'; // set loader to visible
    const selection = Array.from(document.getElementsByName('selection')).find((x) => x.checked).id;
    await runGoogle("armorSetter", [
        selection,
        armor.value,
        ID('stats').value,
        ID('nataStats').value,
        ID('shield').checked,
        {
            armor: Number(ID('armorbonus').value),
            shield: Number(ID('shieldbonus').value),
            nat: Number(ID('natbase').value),
            other: Number(ID('otherbonus').value)
        },
        {
            ba: ID('banotes').value,
            ud: ID('udnotes').value,
            nat: ID('natnotes').value,
            shield: ID('shieldnotes').value,
            other: ID('othernotes').value
        },
        {
            name: ID('customname').value,
            baseAC: Number(ID('custombase').value),
            plusDex: ID('customcheck').checked,
            dexMax: Number(ID('dexmax').value),
            strReq: ID('strengthReq').checked,
            minStr: Number(ID('minSTR').value),
            disStealth: ID('customStealth').checked
        }
    ]);
    google.script.host.close(); // wait for armor to be set, then close dialog
}
document.addEventListener("DOMContentLoaded", async () => {
    armorOptions = await runGoogleWithReturn("armorInfo"); // get the armor options
    const array = await armorOptions; // set array to armor options
    const options = array.map(x => capitalizer(x.name)); // define options as the capitalised version of each name
    for (let a of options) { // loop through options
        const el = document.createElement("option"); // create option element
        el.textContent = a; // set text content and value to a
        el.value = a; // ^^^
        armor.appendChild(el); // add el to armor
    }
    str = Number(await runGoogleWithReturn('getStr')); // get strength score and save to str variable
});
function changer() {
    const warning1 = ID('warning1'), // str requirement warning
    baSelect = ID('armortypes'), // base armor selector
    custom = ID('customarmor'); // custom armor span
    try {
        if (baSelect.value.toLowerCase() !== 'custom') { // if base armor selection is not custom
            ID('customname').required = false; // make custom name input not required
            custom.classList.toggle('magic', true); // hide custom if not already hidden
            const current = armorOptions.find(x => x.name.toLowerCase() == baSelect.value.toLowerCase()); // get current armor
            if (current.strReq != '-')
                doWarn(Number(current.strReq.slice(4))); // if current armor has a strength requirement, call doWarn
        }
        else if (baSelect.value.toLowerCase() === 'custom') { // if base armor selection is custom
            custom.classList.toggle('magic', false); // show custom if not already shown
            ID('customname').required = true; // make custom name input required
            if (ID('strengthReq').checked)
                doWarn(Number(ID('minSTR').value)); // call do warn if strength requirement is selected
        }
        else
            warning1.className = 'magic'; // otherwise hide warning1
    }
    catch (err) {
        console.error(err);
    } // log error if error
    /** Shows or hides warning1 based on input
     * @param {number} req */
    function doWarn(req) {
        if (baSelect.value.toLowerCase() !== 'custom') { // if base armor selection is not custom
            if (str < req)
                warning1.className = ""; // if str < req show warning1
            else
                warning1.className = "magic"; // otherwise hide warning1
        }
        else {
            if (str < req && ID('strengthReq').checked)
                warning1.className = ""; // show warning1 if str < req
            else
                warning1.className = "magic"; // otherwise hide warning1
        }
    }
}
qryA('#form input[type="radio"]').forEach((x) => x.onchange = handler); // for each radio input, set the changer function to handler
/** Handles the selection between different armor types */
function handler() {
    const shield = ID('shield'), // shield selection
    strReq = ID('strengthReq'), // strength requirement
    warn = ID('warning'), // shield warning
    warn1 = ID('warning1'), // strength warning
    sel = Array.from(document.getElementsByName('selection')).find((x) => x.checked).id; // get id of selected radio button
    switch (sel) {
        case 'ba': // case for base armor
            warn.className = 'magic'; // hide shield warning
            const min = armor.value.toLowerCase() !== 'custom' ? // strength minimum
                Number(armorOptions.find(x => x.name.toLowerCase() == armor.value.toLowerCase()).strReq.slice(4)) :
                strReq.checked ? Number(ID('minSTR').value) : 0;
            if (str < min)
                warn1.className = ''; // if strength is less than minimum, show warning 1
            else
                warn1.className = 'magic'; // otherwise, hide warning 1
            break;
        case 'ud': // case for unarmored defense
            warn1.className = 'magic'; // hide strength requirement warning
            if (shield.checked)
                warn.className = ''; // if shield is selected, show warning
            break;
        default:
            warn.className = 'magic'; // hide both warnings
            warn1.className = 'magic'; // ^^^
    }
}
function customCheck() {
    const check = ID('customcheck'); // +dex checkbox
    if (check.checked)
        ID('dexcontainer').className = ''; // if checked, show options
    else
        ID('dexcontainer').className = 'magic'; // otherwise, hide options
}
function customStr() {
    if (ID('strengthReq').checked) { // if custom strength requirement is checked
        ID('minstr').className = ''; // show strength requirement options
        if (str < Number(ID('minSTR').value))
            ID('warning1').className = ''; // if str is less than minSTR val, show strength warning
    }
    else {
        ID('minstr').className = 'magic'; // hide strength requirement options and warning
        ID('warning1').className = 'magic'; // ^^^
    }
}
