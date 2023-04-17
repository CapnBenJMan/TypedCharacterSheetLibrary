qryA('input').forEach(x => x.autocomplete = 'off'); // turn off input autocomplete
var addedit, editrow;
const loader = ID('loader');
document.addEventListener("DOMContentLoaded", async () => {
    loader.style.visibility = 'visible'; // show loader
    const res = await runGoogleWithReturn('getClassInfo');
    addedit = res.arr[0]; // gets the type of edit
    editrow = res.arr[1]; // gets the edited row
    runGoogle('clearClassEdit'); // removes the stored class edit in the character sheet
    switch (addedit) {
        case 'edit': // if editing a class
            function _a(o) { }
            _a(res.arr[2]);
            ID('class').value = res.arr[2].class; // store class value
            ID('subclass').value = res.arr[2].subclass; // store subclass value
            ID('level').value = res.arr[2].level; // store level
            ID('hitdie').value = res.arr[2].hitdie; // store hitdie
            ID('spellcasting').value = res.arr[2].spells; // store spells
            makeEditable(); // run make editable
            break;
        case 'add': // if adding a class
            makeEditable(); // run make editable
            break;
    }
    function makeEditable() {
        ['class', 'subclass', 'level', 'hitdie', 'spellcasting'].forEach(x => ID(x).readOnly = false); // readOnly setters
        ['addedit', 'removeClass'].forEach(x => ID(x).disabled = false); // disabled setters
        ID('level').max = String((20 - res.lvl) + (res.arr[2] ? Number(res.arr[2].level) : 0)); // set level max
        loader.style.visibility = 'hidden'; // hide loader
        console.log("Loaded");
    }
});
function submissionHandler(e) {
    e.preventDefault(); // stops form submission
    try {
        const a = ID('class').value, b = ID('level').value, c = ID('hitdie').value;
        if (a != '' && b != '' && c != '') { // if each required input is not blank
            var className = capitalizer(a), subclass = ID('subclass').value, level = Number(b), levelMax = Number(ID('level').max), hitdie = Number(c), spells = ID('spellcasting').value;
            if ([6, 8, 10, 12].some(x => x == hitdie) && level <= levelMax) { // if hitdie is a valid value and level is less than level max
                loader.style.visibility = 'visible'; // show loader
                setTimeout(() => google.script.host.close(), 1500); // close dialog after 1.5s
                runGoogle("addEditInfo", [className, capitalizer(subclass), level, hitdie, spells, editrow, addedit]); // run addEditInfo with these arguments
            }
        }
        else
            console.log(a, b, c);
    }
    catch (err) {
        console.error(err);
    }
}
function removeClassClicker(e) {
    e.preventDefault();
    loader.style.visibility = 'visible'; // show loader
    setTimeout(() => google.script.host.close(), 1500); // close dialog after 1.5s
    runGoogle("addEditInfo", ['', '', '', '', '', editrow]); // run addEditInfo with mostly empty arguments
}
