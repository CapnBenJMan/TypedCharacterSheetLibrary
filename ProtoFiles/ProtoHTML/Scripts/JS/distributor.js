var total;
document.addEventListener("DOMContentLoaded", async () => {
    const currency = await runGoogleWithReturn('getCurrency'); // get current currency values
    total = currency.reduce((total, x, i) => total + Number(x) * Math.pow(10, 3 - i), 0); // assign currency totals to total
    ID('available').value = String(total); // set available value to total
});
qryA('div>div>div>input').forEach((x) => {
    x.onchange = () => {
        const plat = Number(ID('plat').value) * 1000, // get platinum values
        gold = Number(ID('gold').value) * 100, // get gold values
        silv = Number(ID('silv').value) * 10, // get silver values
        copp = Number(ID('copp').value); // get copper values
        ID('available').value = String(total - (plat + gold + silv + copp)); // modify available value to reflect new values
    };
});
/** Applies the modified values to the accounting sheet */
async function handler() {
    if (Number(ID('available').value) == 0) { // if coin has been distributed properly
        let n = (x) => Number(ID(x).value); // arrow function for conveniecne
        await runGoogle('runManualDistributor', [[n('plat'), n('gold'), n('silv'), n('copp')]]);
        // ^run manual distributor function for each coin value
        google.script.host.close(); // close dialog
        return;
    }
    ID('error').className = ''; // show error
}
