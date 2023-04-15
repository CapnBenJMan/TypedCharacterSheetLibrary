/// <reference types="google-apps-script" />
/** This function handles the execution of the long rest code */
declare function longRest(): void;
/** This function handles the execution for the short rest code */
declare function shortRest(): void;
/** This function opens the dialog to add a rest rule to the sheet */
declare function addLongRest(): void;
/** This function removes a rest rule from the sheet */
declare function removeLongRest(): void;
/** This function adjusts the number of expended hit dice.
 * If less than half the total remains, opends a dialog asking for manual adjustment */
declare function adjustHitDice(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void;
declare function getHitDice(): {
    maxd6: number;
    maxd8: number;
    maxd10: number;
    maxd12: number;
    expendedd6: number;
    expendedd8: number;
    expendedd10: number;
    expendedd12: number;
    readonly maxReplacement: number;
};
declare function updateHitDice(d6?: number, d8?: number, d10?: number, d12?: number, bool?: boolean, plus?: number, initial?: any[]): void;
