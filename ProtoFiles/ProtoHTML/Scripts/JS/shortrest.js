const returns = runGoogleWithReturn('getHitDice');
document.addEventListener("DOMContentLoaded", async () => {
    ID('loader').classList.remove('magic'); // show loader
    const hitDice = await returns; // get the return value of the returns promise
    console.log(hitDice); // log hitDice
    {
        [6, 8, 10, 12].forEach(i => {
            qry(`#d${i}>td:nth-child(2)`).innerHTML = hitDice[`expendedd${i}`]; // set expended hit dice
            qry(`#d${i}>td>input`).max = hitDice[`maxd${i}`]; // set max hit dice
        });
    }
    ID('loader').classList.add('magic'); // hide loader
});
async function submission() {
    event.preventDefault();
    let val = dx => Number(qry(`#${dx}>td>input`).value);
    // ^arrow function for getting the value of a certain die's input element as a number
    const hitDice = await returns; // get hit dice from returns promise
    const dice = { d6: 0, d8: 0, d10: 0, d12: 0 }; // dice object for getting the amount of hit dice that should be remaining
    for (let i in dice)
        dice[i] = Number(hitDice[`expended${i}`]) - val(i); // This calculates the values of the above comment
    setTimeout(() => { google.script.host.close(); }, 1500); // close the dialog after 1.5s
    runGoogle('updateHitDice', [dice.d6, dice.d8, dice.d10, dice.d12, true,
        Number(ID('rolledhealth').value),
        [val('d6'), val('d8'), val('d10'), val('d12')]]); // run updateHitDice with these parameters
}
function clear0() {
    google.script.host.close(); // closes the dialog
}
