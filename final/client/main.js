import {loadPage, dataToElements, forEachElem, $, zElem, contains} from "./util.js";
import {getElemPos, dragElem, makeDraggable, makeEditable} from "./dragelement.js";

/**
 * Author: Matthew MT
 * Date: 05/03/2020
 * Notes:
 * This is based off of project 2, with heavy refactorization and modularization.
 * To use this project, see final/server.js
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

        document.cookie = "username=1;";
        let temp, username, stored = document.cookie.match(/username=(\w)/);
        if (stored || stored.length) temp = await (await fetch("http://" + location.host + "/dynamic/users/profile.json?user=" + (username = stored[1]), {method: "GET"})).json();
        if (!username || !Object.keys(temp.data).length) {
            username = await (await fetch("http://" + location.host + "/dynamic/util/randomID.json", {method: "GET"})).json();
            if (!username || !username.data) alert("Could not generate a new username.");
            else temp = await (await fetch("http://" + location.host + "/dynamic/users/profile.json?user=" + (username = username.data), {method: "GET"})).json();
        }
        if (username) document.cookie = "username=" + username + ";";
        if (!Object.keys(temp.data)) ;
        else elements.splice(elements.length - 1, 0, ...temp.data.cart);
        //console.log(elements);
    
        $("palette").innerHTML = dataToElements(menu, true);
        $("main-zone").innerHTML = dataToElements(elements, false);
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
});