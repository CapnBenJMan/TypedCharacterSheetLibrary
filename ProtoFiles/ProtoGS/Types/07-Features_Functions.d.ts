/// <reference types="google-apps-script" />
declare function formulaCopy(start: GoogleAppsScript.Spreadsheet.Range, end: GoogleAppsScript.Spreadsheet.Range): void;
declare function findPosition(searchKey: string | number, listType: "Simple" | "Complex" | "Weapons" | "Notes", sheetList: GoogleAppsScript.Spreadsheet.Sheet): {
    row: number;
    col: number;
} | undefined;
declare function saveSimple(): void;
declare function loadSimple(): void;
declare function saveComplex(): void;
declare function loadComplex(): void;
