import {loadPage, dataToElements, forEachElem, $, zElem, contains} from "./util.js";
import {getElemPos, dragElem, makeDraggable, makeEditable} from "./dragelement.js";

/**
 * Author: Matthew MT
 * Date: 04/28/2020
 * Notes:
 * The following code is a bit rushed and convoluted at the same time, but works.
 */

const
    menu = [],
    elements = []/* = [
        "<div class=\"zone-element\"><div>Hi, I'm an element, and so are the ones beside me.</div></div>",
        "<div class=\"zone-element\"><div>You can drag us around to change our order.</div></div>",
        "<div class=\"zone-element\"><div>You could also delete some of us...</div></div>",
        "<div class=\"zone-element\"><div>Or edit an element or two...</div></div>",
        "<div class=\"zone-element\"><div>Or drag new elements over from the palette up top.</div></div>"
    ]*/,
    //menuUI = $("palette"),
    //main = $("main-zone"),
    //drag = $("drag"),
    //bag = $("bag"),
    //loginButton = $("login-button"),
    cart = {
        "bags": []
    };





window.addEventListener("load", async (event) => {
    await loadPage("/pieces/lobby.html");
    $("login-button").addEventListener("click", async (event) => {
        await loadPage("/pieces/menu.html");
        let
            main = $("main-zone"),
            drag = $("drag"),
            bag = $("bag");
        menu.splice(0, menu.length, ...(await (await fetch("http://" + location.host + "/static/menu.json", {method: "GET"})).json()).list);
        //console.log(elements);
    
        $("palette").innerHTML = dataToElements(menu, true);
        makeDraggable(main, menu, drag, ".new-zone-element", true, elements, ".zone-element");
        //makeEditable(menu, drag, ".zone-element");
        let
            bagW = menu.length * 6;
        if (bagW > 40) bagW = 40;
        let
            bagH = bagW * 2.98,
            bagW_s = bagW + "vw",
            bagH_s = bagH + "vh";
        bag.style.width = bagW_s;
        bag.style.height = bagH_s;
        main.style.width = bagW_s;
        main.style.height = bagH_s;
        /*main.style.height = "10.65rem";*/ 
    });

    document.cookie = "username=1;";
    let temp, username, stored = document.cookie.match(/username=(\w)/);
    if (stored) temp = await (await fetch("http://" + location.host + "/dynamic/users/profile.json?user=" + stored[1], {method: "GET"/*, body: JSON.stringify({username: 1})*/})).json();
    if (!temp.data) {
        username = await (await fetch("http://" + location.host + "/dynamic/util/randomID.json", {method: "GET"/*, body: JSON.stringify({username: 1})*/})).json();
        if (!username.data) alert("Could not generate a new username.");
        else temp = await (await fetch("http://" + location.host + "/dynamic/users/profile.json?user=" + stored[1], {method: "GET"/*, body: JSON.stringify({username: 1})*/})).json();
    }


    /*console.log(await (await fetch("http://" + location.host + "/dynamic/users/profile.json", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: "1", cart: elements})
    })).json());*/
    //console.log(await (await fetch("http://" + location.host + "/dynamic/users/profile.json?user=1", {method: "GET"/*, body: JSON.stringify({username: 1})*/})).json());
});