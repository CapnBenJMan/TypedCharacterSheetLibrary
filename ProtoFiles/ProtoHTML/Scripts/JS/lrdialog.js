qryA("input").forEach(x => x.autocomplete = "off");
const type = ID("type"); // defines reference to type element and its options
const info = ID("infotext"); // defines reference to infotext
async function submission() {
    ID("loader").style.visibility = "visible"; // set loader to visible
    const range = await runGoogleWithReturn("selection"); // get range of current cell
    const r1 = type.value, // selected option
    r2 = ID("shortrest").checked, // runs on short rest
    r3 = r2 ? "short or long" : "long"; // type of rest
    await runGoogle("restCompiler", [range, r1, r2, r3]); // runs rest compiler
    google.script.host.close(); // closes dialog
}
type.addEventListener("change", t => {
    const tt = {
        "current": `Current Value: Select this option to have the sheet reset this cell to its current value.`,
        "cell": `Value of a Cell: Select this option to have the sheet reset this cell to the value of a certain cell.`,
        "inputval": `Input Value: Select this option to have the sheet reset this cell to a value inputted by the user on long rest.`,
        "other": `Other Value: Select this option to have the sheet reset this cell to a specific value.`,
        "randomnum": `Random Number Value: Select this option to have the sheet reset this cell to a random value in dice format (ex. 1d4-1).`,
        "randomlist": `Random List Item: Select this option to have the sheet reset this cell to a random item on a list.`,
        "modconstant": `Constant Modify: Select this option to have the sheet modify this cell by a given numeric value.`,
        "modinput": `Input Modify: Select this option to have the sheet modify this cell by a value inputted by the user.`,
        "srreminder": `Short Rest Reminder: Select this option to have the sheet give you a reminder when you take a short rest (ex. Wizard's Arcane Recovery).`,
    };
    info.innerHTML = tt[t.target.value];
});
