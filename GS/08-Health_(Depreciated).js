/** @deprecated */
function healthDepreciated(e) {
    if (e.range.getA1Notation() === "R17" && e.range.getSheet().getName() === "Character") { //check if input is in Current Health cell and in Character sheet
        var healthP = e.range; //input position
        const health = e.value; //input value
        const maxHP = e.source.getRange("U16").getValue(); //max health
        var tempP = e.source.getRange("R21"); //temporary health position
        const tempHP = tempP.getValue(); //temporary health
        var barHealth = e.source.getRange("AQ1");
        if (health == null) { //when the cell is cleared
            modHealth(maxHP); //sets the cell to max health
            modTemp(null); //clears temporary HP
        }
        else if (health.indexOf("-") == 0) { //calculates damage
            const damage = parseInt(health.replace("-", ""));
            const oldHealth = parseInt(e.oldValue);
            if (tempHP > 0) { //check if character has temporary hit points
                if (damage >= tempHP) { //check if damage taken equals or exceeds temporary hit points
                    const healthDmg = damage - tempHP; //calculates how much damage is taken by current hit points after tempHP reduction
                    modTemp(null); //sets tempHP to 0
                    modHealth(oldHealth - healthDmg); //calculates damage to health after tempHP reduction
                }
                else { //if damage taken is less than tempHP
                    modTemp(tempHP - damage); //reduces tempHP by damage amount
                    modHealth(oldHealth); //keeps current health the same
                }
            }
            else { //if character doesn't have tempHP
                modHealth(oldHealth - damage); //calculates damage to health
            }
        }
        else if (health.indexOf("=") == 0) { //calculates healing
            const calcH = parseInt(health.replace("=", "")) + parseInt(e.oldValue); //defines the calculated health after healing
            if (calcH > maxHP) { //checks if healing exceeds maxHP
                modHealth(maxHP); //if true,set health to maxHP
            }
            else {
                modHealth(calcH); //if false, continue as normal
            }
        }
        else {
            SpreadsheetApp.getUi().alert("If you are seeing this, please enter a value that begins with \"+\" for healing or \"-\" for damage."); //alerts user of an input error
            modHealth(e.oldValue); //reverts health to value before error
        }
    }
    function modHealth(h) {
        healthP.setValue(h);
        barHealth.setValue(h);
    }
    function modTemp(t) {
        tempP.setValue(t);
    }
}
