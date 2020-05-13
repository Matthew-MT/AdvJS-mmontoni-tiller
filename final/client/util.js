const
    loadTarget = $("content-wrapper");

export function forEachElem(elemQuery, callback) {
    document.querySelectorAll(elemQuery).forEach(callback);
}

export function $(id) { // NOT JQUERY
    return document.getElementById(id);
}

export function zElem(text, img = null, newElem = false) {
    return (
        "<div class=" + (newElem ? "\"new-zone-element\"" : "\"zone-element\"") + (img ? " background=\"" + img + "\"" : " background=\"\"") + ">"
        + "<div class=\"element-content\">" + text + "</div>"
        + "<div class=\"element-background has-background\"" + (img ? " style=\"background-image: url(" + img + ")\"" : "") + "></div>"
        + "</div>"
    );
}

export function dataToElements(elements, newElems = false) {
    return elements.map(v => zElem(v.txt, v.img, newElems)).join("\n");
}

export function elemToData(elem) {
    return {
        "txt": elem.textContent,
        "img": elem.background
    };
}

/**
 * Checks whether the position is contained within the element.
 * Used in this program to run this check on the cursor.
 */
export function contains(x, y, elem) {
    return (x > elem.offsetLeft - window.scrollX && y > elem.offsetTop - window.scrollY && x < (elem.offsetLeft + elem.offsetWidth) - window.scrollX && y < (elem.offsetTop + elem.offsetHeight) - window.scrollY);
}

export async function loadPage(loc) {
    let page = await (await fetch("http://" + location.host + loc, {method: "GET"})).text();
    if (!page) throw "Page doesn't exist: " + location.host + loc;
    else loadTarget.innerHTML = page;
}