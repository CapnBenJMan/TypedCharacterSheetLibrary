function validationBuilder(ss, vals) {
    const dv = SpreadsheetApp.newDataValidation;
    return vals.map(x => x.map(y => {
        if (y == null)
            return null;
        switch (y[0]) {
            case 'CHECKBOX':
                return dv().requireCheckbox().build();
            case 'VALUE_IN_RANGE':
                return dv().requireValueInRange(ss.getRange(y[1][0])).setAllowInvalid(y[1][1]).build();
            default:
                return dv().withCriteria(SpreadsheetApp.DataValidationCriteria[y[0]], y[1]).build();
        }
    }));
}
function textstyleBuilder(all) {
    console.time('Style Builder');
    const text = all.map(x => x.map(y => {
        return SpreadsheetApp.newTextStyle()
            .setFontFamily(y.f)
            .setFontSize(y.si)
            .setForegroundColor(y.c)
            .setBold("b" in y)
            .setItalic("i" in y)
            .setStrikethrough("s" in y)
            .setUnderline("u" in y)
            .build();
    }));
    console.timeEnd('Style Builder');
    console.log(text);
    return text;
}
// /**
//  * @param {{ f:string, s:number }[][]} font
//  * @param {string[][]} color
//  * @param {{ b?:string, i?:string, s?:string, u?:string }[][]} styles
//  * @returns {Promise<GoogleAppsScript.Spreadsheet.TextStyle[][]>}
//  */
/* function textstyleBuilder(font, color, styles) {
    console.time('Style Builder')
    const font0 = font.map(x => x.map(y => { return { f: y.f, si: y.s } }))
    const all = [...Array(font.length)].map((x, i) => Array(font[0].length).map((y, j) => {
        return {
            ...font0[i][j],
            c: color[i][j],
            ...styles[i][j]
        }
    }))
    return new Promise((res, _rej) => {
        const text = all.map(x => x.map(y => {
            return SpreadsheetApp.newTextStyle()
                .setFontFamily(y.f)
                .setFontSize(y.si)
                .setForegroundColor(y.c)
                .setBold("b" in y)
                .setItalic("i" in y)
                .setStrikethrough("s" in y)
                .setUnderline("u" in y)
                .build()
        }))
        console.timeEnd('Style Builder')
        console.log(text)
        res(text)
    })
} */ 
