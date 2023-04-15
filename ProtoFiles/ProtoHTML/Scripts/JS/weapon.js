qryA('input').forEach(x => x.autocomplete = 'off');
const weapons = ID('weapons'); // defines reference to type element and its options
async function submission() {
    ID('loader').style.visibility = 'visible'; // set loader to visible
    const props = [...((ID('customprops').value !== '') ?
            String(ID('customprops').value).split(/(?<!\() *, *(?![\w\s]*\))/g)
            : ['-']), (ID('custompropsExt').innerHTML !== '') ? `Additional Info:\n\n${ID('custompropsExt').innerHTML}` : '']
        .filter(x => x !== ''), custom = {
        name: capitalizer(ID('customname').value),
        damage: `${ID('customdmgNum').value}d${ID('customdmgDie').value} ${ID('customdmgType').value}`,
        props,
        type: ID('customtype').value
    };
    await runGoogle("weaponSetter", [
        weapons.value,
        ID('proficient').checked,
        ID('same').checked,
        {
            bonus: Number(ID('samebonus').value),
            attBonus: Number(ID('attackbonus').value),
            damBonus: Number(ID('damagebonus').value)
        },
        custom,
        {
            bool: ID('overridebool').checked,
            val: ID('overrideval').value,
            mw: ID('ismonkweapon').checked
        }
    ]);
    google.script.host.close();
}
document.addEventListener("DOMContentLoaded", async () => {
    const array = await runGoogleWithReturn('weaponInfo');
    var options = array.map(x => capitalizer(x.name));
    for (let a of options) {
        var el = document.createElement("option");
        el.textContent = a;
        el.value = a;
        weapons.appendChild(el);
    }
});
const same = ID("same"), ddiv = ID("differentdiv");
same.onclick = () => {
    if (same.checked) {
        ddiv.style.visibility = 'visible';
        ddiv.style.position = 'initial';
    }
    else {
        ddiv.style.visibility = 'hidden';
        ddiv.style.position = 'absolute';
    }
};
/** @param {boolean} bool */
function toggleWeaponProps(bool) {
    ID('propspan').classList.toggle('magic', bool);
    ID('propback').classList.toggle('magic', bool);
}
function changer() {
    const custom = ID('custom');
    if (ID('weapons').value === 'Custom')
        custom.classList.toggle('magic', false);
    else
        custom.classList.toggle('magic', true);
}
ID('overridebool').onchange = () => {
    if (ID('overridebool').checked) {
        ID('overridespan').className = '';
    }
    else {
        ID('overridespan').className = 'magic';
    }
};
