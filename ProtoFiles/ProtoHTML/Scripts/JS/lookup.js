qryA("input").forEach(x => x.autocomplete = "off"); // disable autocomplete for each input element
const urlFormatter = (n) => n.replace(/'/g, ``).replace(/\/| /g, `-`).toLowerCase();
// ^arrow function for formatting urls
function changer() {
    if (String(ID("searchoptions").value) != "class")
        qry("form").style.display = "flex";
    else
        qry("form").style.display = "block";
    ID("variance").innerHTML = searchOptions[String(ID("searchoptions").value)];
    try {
        const ih = ID("selector").innerHTML
            .split(/(?<=>)(?:\n|\t)+?(?=<)/g)
            .map(x => x.replace(/(?:\n|\t)/g, ""))
            .sort((a0, b0) => {
            const a = a0.match(/(?<=>).*?(?=<)/)[0].toUpperCase();
            const b = b0.match(/(?<=>).*?(?=<)/)[0].toUpperCase();
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        }).filter(x => x != "<option value=\"\"></option>").join("\n");
        ID("selector").innerHTML = ih;
    }
    catch {
        // continue regardless of error
    }
    qryA("input").forEach(x => x.autocomplete = "off");
}
function classChange() {
    const classval = String(ID("classSearch").value);
    if (classval == "sub") {
        ID("subsearchdiv").className = "";
        ID("subsearch").required = true;
    }
    else {
        ID("subsearchdiv").className = "magic";
        ID("subsearch").required = false;
    }
}
async function handler(e) {
    ID("loader").style.visibility = "visible";
    try {
        e.preventDefault();
        ID("outputdiv").innerHTML = "";
        const searches = {
            "class": "classSearch",
            "feat": "searchbar",
            "item": "searchbar",
            "spell": "searchbar",
            "race": "searchbar",
            "background": "searchbar",
            "misc": "selector"
        };
        const search = ID(searches[ID("searchoptions").value]).value == "level" ?
            Number(ID("searchbar").value.match(/\d+/)) :
            searches[ID("searchoptions").value] == "selector" ?
                String(ID("selector").value) : String(ID("searchbar").value);
        let baseURL = "http://dnd5e.wikidot.com";
        const Regex = {
            prettier: /(?:<\/?a.*?>|(?:id|class)=".+?"|<script(?:.|\n)+?<\/script>)/g
        };
        switch (String(ID("searchoptions").value)) {
            case "class":
                const Class = urlFormatter(String(ID("classname").value));
                const subclass = urlFormatter(String(ID("subclassname").value));
                const subsearch = urlFormatter(String(ID("subsearch").value));
                baseURL += `/${Class}`;
                if (subclass != "")
                    baseURL += `:${subclass}`;
                if (subsearch != "" && String(ID("classSearch").value) == "sub")
                    baseURL += `:${subsearch}`;
                Regex.featureNamePt1 = new RegExp(`<span>${(String(ID("classSearch").value) == "name") ? capitalizer(String(search)) :
                    ""}<\\/span><\\/h(?<num>\\d)>\\n<p>(?:.|\\n)*?(?=\\n<h\\k<num>)`, "i");
                Regex.featureNamePt2 = new RegExp(`(?<=<span>${(String(ID("classSearch").value) == "name") ? capitalizer(String(search)) :
                    ""}<\\/span><\\/h)\\d+(?=>)`, "");
                Regex.featureLevelPt1 = new RegExp(`<span>.+<\\/span><\\/h(?<num>\\d)>\\n<p>(?:.|\\n){1,200}?\\b${search}(?:st|nd|rd|th) level(?:.|\\n)*?(?=(?:\\n<h\\k<num>|\\n?\\t*?<\\/div>))`, "gi");
                Regex.featureLevelPt2 = new RegExp(`(?<=<\\/span><\\/h)\\d+(?=>)`, "");
                Regex.featureSubPt1 = new RegExp(`(?:<span.*?>){1,2}${capitalizer(String(search))}(?:<\\/span>\\n?\\t*?){1,2}<\\/h(?<num>\\d)>(?:.|\\n)*?(?=(?:\\n<h\\k<num>|\\n?\\t*?<\\/div>))`, "i");
                Regex.featureSubPt2 = new RegExp(`(?<=<\\/span><\\/h)\\d+(?=>)`, "");
                break;
            case "feat":
                baseURL += `/feat:${urlFormatter(String(ID("searchbar").value))}`;
                break;
            case "item":
                baseURL += `/wondrous-items:${urlFormatter(String(ID("searchbar").value))}`;
                break;
            case "spell":
                baseURL += `/spell:${urlFormatter(String(ID("searchbar").value))}`;
                break;
            case "race":
                baseURL += `/${urlFormatter(String(ID("searchbar").value))}`;
                break;
            case "background":
                baseURL += `/background:${urlFormatter(String(ID("searchbar").value))}`;
                break;
            case "misc":
                baseURL += `/${ID("selector").value}`;
                break;
        }
        let response0, bo = false;
        try {
            response0 = await runGoogleWithReturn("returnFetch", [baseURL]);
        }
        catch {
            try {
                if (String(ID("searchoptions").value) == "spell")
                    throw "";
                baseURL += "s";
                bo = true;
                response0 = await runGoogleWithReturn("returnFetch", [baseURL]);
            }
            catch {
                if (bo)
                    baseURL = baseURL.slice(0, -1);
                baseURL += "-ua";
                response0 = await runGoogleWithReturn("returnFetch", [baseURL]);
            }
        }
        const response = response0;
        const el = document.createElement("html");
        el.innerHTML = response;
        try {
            qry("#toc", el).remove();
        }
        catch {
            // removes the table of contents
        }
        try {
            qryA("span.hover", el).forEach(x => {
                const span = qry("span", x);
                span.outerHTML = ` (${span.innerHTML}) `;
            });
        }
        catch {
            // no idea
        }
        if (String(ID("searchoptions").value) == "misc" && String(ID("selector").value) != "trinkets") {
            try {
                qryA(".yui-nav", el).forEach(x => x.remove());
            }
            catch { /* continue regardless of error */ }
            try {
                qryA(".yui-content>div", el).forEach(x => x.style.display = "");
            }
            catch { /* continue regardless of error */ }
        }
        if (search != "") {
            switch (String(ID("searchoptions").value)) {
                case "class":
                    const features = qry(".feature", el);
                    switch (String(ID("classSearch").value)) {
                        case "name": {
                            const [refine] = features.innerHTML.match(Regex.featureNamePt1);
                            const parsedHTML = `<h${refine.match(Regex.featureNamePt2)}>${refine.replace(Regex.prettier, "")}`;
                            ID("outputdiv").innerHTML = parsedHTML;
                            break;
                        }
                        case "level": {
                            const refine = features.innerHTML.match(Regex.featureLevelPt1)
                                .filter(x => x.length > 10)
                                .map(x => `<h${x.match(Regex.featureLevelPt2)}>${x.replace(Regex.prettier, "")}`)
                                .join("");
                            ID("outputdiv").innerHTML = refine;
                            break;
                        }
                        case "sub": {
                            const [refine] = features.innerHTML.match(Regex.featureSubPt1);
                            const parsedHTML = `<h${refine.match(Regex.featureSubPt2)}>${refine.replace(Regex.prettier, "")}`;
                            ID("outputdiv").innerHTML = parsedHTML;
                            break;
                        }
                    }
                    break;
                case "feat":
                    const feat = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
                    ID("outputdiv").innerHTML = `<h3><span>${capitalizer(String(search))}</span></h3>` + feat;
                    break;
                case "item":
                    const item = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
                    ID("outputdiv").innerHTML = `<h3><span>${capitalizer(String(search))}</span></h3>` + item;
                    break;
                case "spell":
                    const spell0 = qry("#page-content", el);
                    qryA("div", spell0).forEach(x => { if (/\+.*?Show.*?HB.*?Suggestion/.test(x.innerHTML))
                        x.remove(); });
                    const spell = spell0.innerHTML.replace(Regex.prettier, "");
                    ID("outputdiv").innerHTML = `<h3><span>${capitalizer(String(search)) + (baseURL.slice(-3) == "-ua" ? " (UA)" : "")}</span></h3>` + spell;
                    break;
                case "race":
                    qryA("#page-content h1", el).forEach(x => x.outerHTML = `<h2>${x.innerHTML}</h2>`);
                    const race = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
                    ID("outputdiv").innerHTML = `<h1><span>${capitalizer(String(search))}</span></h1>` + race;
                    break;
                case "background":
                    qryA("#page-content h2", el).forEach(x => x.outerHTML = `<h3>${x.innerHTML}</h3>`);
                    qryA("#page-content h1", el).forEach(x => x.outerHTML = `<h2>${x.innerHTML}</h2>`);
                    const bg = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
                    ID("outputdiv").innerHTML = `<h1><span>${capitalizer(String(search))}</span></h1>` + bg;
                    break;
                case "misc":
                    const misc = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
                    const title = qry(`option[value="${ID("selector").value}"`).innerHTML;
                    ID("outputdiv").innerHTML = `<h1><span>${title}</span></h1>` + misc;
                    if (title == "Trinkets") {
                        const sources = Array.from(qryA("#outputdiv>div>ul>li>em")).map(x => x.innerHTML);
                        const lists = Array.from(qryA("#outputdiv>div>div>div")).map(x => x.innerHTML);
                        ID("outputdiv").innerHTML = sources.reduce((final, cur, i) => final + `<h2>${cur}</h2><div>${lists[i]}</div>`, "");
                    }
                    else if (title == "Tools") { /* nothing yet */ }
                    break;
            }
        }
        else if (String(ID("searchoptions").value) == "class")
            ID("outputdiv").innerHTML = qry("#page-content", el).innerHTML.replace(Regex.prettier, "");
    }
    catch (err) {
        ID("outputdiv").innerHTML = `An error occurred. Either the thing you requested doesn't exist, or the program encountered an issue while retrieving it.
	If you attempt this again, please make sure you entered it correctly.`;
        console.error(err);
    }
    ID("loader").style.visibility = "hidden";
}
function clear0() {
    ID("outputdiv").innerHTML = "";
    ID("variance").innerHTML = searchOptions["class"];
    qry("form").style.display = "block";
    qryA("input").forEach(x => {
        x.autocomplete = "off";
    });
}
const searchOptions = {
    "class": `<div class="flexbox-search">
		<div>
			<div>Class</div>
			<input id="classname" data-option="class" type="text" required>
		</div>
		<div>
			<div>Subclass</div>
			<input id="subclassname" type="text" data-option="class" placeholder="Hover to see options"
				title="Leave blank to search only the base class. Include to search in the subclass.">
		</div>
		<div>
			<div>Seach by:</div>
			<select name="classSearch" id="classSearch" onchange="classChange()">
				<option value="name">Feature Name</option>
				<option value="level">Feature Level</option>
				<option value="sub">Subfeature</option>
			</select>
		</div>
	</div>
	<div id="subsearchdiv" class="magic" style="display: flex"><label for="subsearch"
			style="display:flex; align-items: center;">Subfeature
			Type: </label>
		<input id="subsearch" type="text" style="flex: 1"
			placeholder="Ex. Eldritch Invocation, Infusion, etc.">
	</div>
	<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1">
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "feat": `<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1" required>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "item": `<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1" required>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "spell": `<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1" required>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "race": `<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1" required>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "background": `<div id="searchdiv" style="display: flex;">
		<input id="searchbar" type="text" style="flex: 1" required>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`,
    "misc": `<div id="searchdiv" style="display: flex;">
		<select id="selector" style="flex: 1">
			<option value="adventuring-gear">Adventuring Gear</option>
			<option value="armor">Armor</option>
			<option value="weapons">Weapons</option>
			<option value="firearms">Firearms (DMG)</option>
			<option value="fighter:gunslinger:firearm-properties">Firearms (Exandria)</option>
			<option value="explosives">Explosives</option>
			<option value="currency">Currency</option>
			<option value="poisons">Poisons</option>
			<option value="tools">Tools</option>
			<option value="trinkets">Trinkets</option>
		</select>
		<button>Search</button>
		<button type="reset">Clear</button>
	</div>`
};
