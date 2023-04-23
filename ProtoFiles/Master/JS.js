/** Returns the value of the function called
 * @param {string} f The function name
 * @param {any[]} [args] The arguments to be passed to the function
*/
function runGoogleWithReturn(f, args) {
    if (arguments.length == 1)
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(stuff => resolve(stuff))
                .withFailureHandler(err => reject(err))
                .callLibraryFunction(`CharacterSheetCode.${f}`)
        })
    else if (arguments.length == 2)
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(stuff => resolve(stuff))
                .withFailureHandler(err => reject(err))
                .callLibraryFunction(`CharacterSheetCode.${f}`, args)
        })
}
/** Simply calls a function with no return value
 * @param {string} f The function name
 * @param {any[]} [args] The arguments to be passed to the function
*/
function runGoogle(f, args) {
    if (arguments.length == 1)
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(() => resolve())
                .withFailureHandler(err => reject(err))
                .callLibraryFunction(`CharacterSheetCode.${f}`)
        })
    else if (arguments.length == 2)
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(() => resolve())
                .withFailureHandler(err => reject(err))
                .callLibraryFunction(`CharacterSheetCode.${f}`, args)
        })
}
const ID = (n) => document.getElementById(n)
const qry = (n, el = document) => el.querySelector(n)
const qryA = (n, el = document) => el.querySelectorAll(n)
const capitalizer = (x) => {
	if (x.includes(' ')) { // if v includes spaces
		const arr = x.split(" ") // split v on spaces
		for (let j in arr) { // loop through arr
			if (arr[j].includes('\n')) break // break the loop if arr[j] includes \n
			else arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1).toLowerCase()
			// ^otherwise set arr[j] to itself capitalized
		}
		return arr.join(" ") // return the reformatted array joined by spaces
	} else return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase() // otherwise, return capitalized word
}
function show(el) {
	el.classList.remove("magic")
}
function hide(el) {
	el.classList.add("magic")
}