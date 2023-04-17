qryA('input').forEach(x => x.autocomplete = 'off');
var allowedTotal = 0;
document.addEventListener("DOMContentLoaded", async () => {
    ID('loader').style.visibility = 'visible';
    const elements = [
        ID('maxd6'),
        ID('expendedd6'),
        ID('maxd8'),
        ID('expendedd8'),
        ID('maxd10'),
        ID('expendedd10'),
        ID('maxd12'),
        ID('expendedd12')
    ];
    const values = await runGoogleWithReturn("getHitDice");
    allowedTotal = values.maxReplacement;
    elements.forEach(elem => {
        const id = elem.id;
        if (id.includes('maxd')) {
            const dieType = id.slice(-2).replace("d", "");
            elem.innerHTML = `Max d${dieType}: ${values[id]}`;
        }
        else if (_a(elem, id)) {
            const maxType = id.slice(-2).replace("d", "");
            elem.min = values[id];
            elem.max = values[`maxd${maxType}`];
            elem.value = values[id];
        }
        function _a(e, id) {
            return id.includes('expendedd');
        }
    });
    ID('loader').style.visibility = 'hidden';
});
async function update() {
    ID('loader').style.visibility = 'visible';
    let parseVal = (id) => Number(ID(id).value);
    let parseMin = (id) => Number(ID(id).min);
    var startingValue = parseMin('expendedd6') + parseMin('expendedd8') + parseMin('expendedd10') + parseMin('expendedd12'), currentValue = parseVal('expendedd6') + parseVal('expendedd8') + parseVal('expendedd10') + parseVal('expendedd12');
    if (currentValue - startingValue > allowedTotal) {
        var error = ID('error'), dices = 'dice';
        var allowed = currentValue - startingValue - allowedTotal;
        if (allowed == 1)
            dices = 'die';
        error.innerHTML =
            'Error: Your entered values exceed the maximum number of hit dice you are allowed to recover. ' +
                `Please remove ${allowed} hit ${dices} and try again.`;
        error.style.visibility = 'visible';
        ID('loader').style.visibility = 'hidden';
    }
    else {
        await runGoogle("updateHitDice", [parseVal('expendedd6'), parseVal('expendedd8'), parseVal('expendedd10'), parseVal('expendedd12')]);
        google.script.host.close();
    }
}
