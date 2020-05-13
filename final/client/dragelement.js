import {elemToData, dataToElements, forEachElem, $, zElem, contains} from "./util.js";

/**
 * This file contains most of the relevant functions to make element dragging work.
 */

function* holdingElement() {
    let cur = false;
    while (true) cur = (yield cur) ? !cur : cur;
}

function* newOrCurElem() {
    let cur = -1;
    while (true) {
        let temp = yield cur;
        cur = (isNaN(temp) ? cur : temp);
    }
}

let
    holdStatus = holdingElement(),
    newOrCur = newOrCurElem();
holdStatus.next();
newOrCur.next();

export function getElemPos(main, elements, mouseX, mouseY) {
    if (!elements.length) return 0;

    let
        childElem = main.firstChild,
        baseplate = window.getComputedStyle(childElem, ""),
        baseW = parseInt(baseplate.getPropertyValue("width")) + parseInt(baseplate.getPropertyValue("margin-left")) + parseInt(baseplate.getPropertyValue("margin-right")),
        baseH = parseInt(baseplate.getPropertyValue("height")) + parseInt(baseplate.getPropertyValue("margin-top")) + parseInt(baseplate.getPropertyValue("margin-bottom")),
        tmpX = mouseX - main.offsetLeft,
        tmpY = mouseY - main.offsetTop,
        xIndex = Math.floor(tmpX / baseW),
        yIndex = Math.floor(tmpY / baseH),
        maxX = Math.floor(main.offsetWidth / baseW),
        maxY = Math.floor(main.offsetHeight / baseH),
        calcedPos = (yIndex * maxX) + xIndex;

    if (xIndex >= maxX) calcedPos--;
    if (yIndex >= maxY) calcedPos -= maxX;
    if (calcedPos >= elements.length) calcedPos = elements.length - 1;

    return calcedPos;
}

/**
 * Updates the ghost-element based on the position calculated by the function above.
 */
function setupUpdate(main, elements, drag) {
    return function (event) {
        let containedInMain = contains(event.clientX, event.clientY, main);
        if (holdStatus.next().value && containedInMain) {
            let calcedPos = getElemPos(main, elements, event.clientX, event.clientY);

            if (newOrCur.next().value == -1) {
                newOrCur.next(calcedPos);
                elements.splice(calcedPos, 0, {txt: drag.textContent, img: drag.getAttribute("background")}); // Adds the ghost element if the cursor was just dragged over main
                //main.style.height = null;
            } else {
                let pos = newOrCur.next().value;
                if (calcedPos != pos) {
                    newOrCur.next(calcedPos);
                    elements.splice(calcedPos, 0, ...elements.splice(pos, 1)); // This keeps all elements other than the ghost element in the order they were in when the ghost element was created
                }
            }
        
            main.innerHTML = dataToElements(elements);
            main.children[calcedPos].style["background-color"] = "#aaaacc";
            main.children[calcedPos].firstChild.style.color = "#666666"; // These lines make the ghost element stand out
        } else if (!containedInMain) {
            if (newOrCur.next().value != -1) {
                elements.splice(newOrCur.next().value, 1); // Allows the deletion of an element by dragging it away from main
                newOrCur.next(-1);
                main.innerHTML = dataToElements(elements);
                //if (!elements.length) main.style.height = "10.65rem"; // Main stays at least high enough for one element when there are no elements
                //else main.style.height = null;
            }
        }
    }
}

/**
 * Returns a function that, when called, makes the given element draggable within main by the user.
 */
export function dragElem(main, elements, drag, elem, addNew, addTo, query = "") {
    return function (ev) {
        ev.preventDefault();
        let
            pos = [0, 0, ev.clientX, ev.clientY],
            update = setupUpdate(main, addTo, drag, addNew),
            background = elem.getAttribute("background");
        if (addNew) newOrCur.next(-1);
        else newOrCur.next(getElemPos(main, addTo, pos[2], pos[3]));
        drag.style.display = "flex";
        drag.style.left = elem.offsetLeft + "px";
        drag.style.top = elem.offsetTop + "px";
        drag.firstChild.textContent = elem.textContent; // These lines update the invisible "drag" div to appear at the cursor's location
        drag.children[1].style["background-image"] = "url(" + background + ")";
        drag.setAttribute("background", background);
        if (!holdStatus.next().value) holdStatus.next(true);

        function dragInternalMove(e) {
            e.preventDefault();
            pos[0] = pos[2] - e.clientX;
            pos[1] = pos[3] - e.clientY;
            pos[2] = e.clientX;
            pos[3] = e.clientY;
            drag.style.left = (drag.offsetLeft - pos[0]) + "px";
            drag.style.top = (drag.offsetTop - pos[1]) + "px"; // These lines update the drag element's position when the mouse moves
        }
        async function dragInternalMouseUp(e) {
            e.preventDefault();
            document.removeEventListener("mousemove", update);
            document.removeEventListener("mousemove", dragInternalMove);
            document.removeEventListener("mouseup", dragInternalMouseUp);
            drag.style.display = null;
            drag.style.left = null;
            drag.style.top = null;
            drag.firstChild.textContent = null;
            drag.children[1].style["background-image"] = null;
            drag.setAttribute("background", null);

            if (holdStatus.next().value) holdStatus.next(true);
            if (!contains(pos[0], pos[1], main)) forEachElem(".zone-element", (elem) => {
                elem.style["background-color"] = null;
                elem.firstChild.style.color = null;
            });
            if (query) {
                if (elements === addTo) makeDraggable(main, elements, drag, query, addNew, addTo);
                else makeDraggable(main, addTo, drag, query);
            }
            newOrCur.next(-1); // When the mouse is released, re-initialize all elements with their proper functionality and style

            let username = document.cookie.match(/username=(\w)/);
            if (username && username[1]) fetch("http://" + location.host + "/dynamic/users/profile.json", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: username[1], cart: [...addTo]})
            });
        }

        document.addEventListener("mousemove", update);
        document.addEventListener("mousemove", dragInternalMove);
        document.addEventListener("mouseup", dragInternalMouseUp);
    }
}

export function makeDraggable(main, elements, drag, query, addNew = false, addTo = elements, query2 = query) {
    forEachElem(query, (elem) => {
        elem.addEventListener("mousedown", dragElem(main, elements, drag, elem, addNew, addTo, query2));
    });
}

export function makeEditable(main, elements, drag, query) {
    forEachElem(query, (elem) => {
        function editInternalMouseOver(event) {
            let
                temp = elem.innerHTML,
                text = elem.textContent,
                img = elem.getAttribute("background");
            elem.innerHTML = "<textarea class=\"element-edit\">" + text + "</textarea>";

            function eventReturnNormal() {
                let val = elem.firstChild.value;
                elem.innerHTML = temp;
                elem.firstChild.textContent = val;
                elements[Object.values(elem.parentElement.children).indexOf(elem)] = {val, img}; //zElem(val, image); // More one-liner code, I know
                elem.removeEventListener("mouseout", eventReturnNormal);
                elem.addEventListener("mouseover", editInternalMouseOver);
            }
            
            elem.addEventListener("mouseout", eventReturnNormal);
            elem.removeEventListener("mouseover", editInternalMouseOver);
        }
        elem.addEventListener("mouseover", editInternalMouseOver);
        elem.addEventListener("mousedown", (event) => { // This event is specifically designed to allow the element to be edited while also being draggable
            drag.style.display = "flex";
            drag.style.left = elem.offsetLeft + "px";
            drag.style.top = elem.offsetTop + "px";
            drag.style.opacity = "0.2";
            let tempDrag = dragElem(main, elements, drag, elem, false);
            function editInternalGlobalMouseMove(ev) {
                if (!contains(ev.clientX, ev.clientY, elem)) {
                    drag.style.opacity = null;
                    tempDrag(event); // When the mouse is moved outside of the boundary of the element, the drag visualization is activated
                    document.removeEventListener("mousemove", editInternalGlobalMouseMove);
                }
            }
            function editInternalGlobalMouseOut(ev) {
                if (MouseEvent.buttons & 1 == 1) {
                    document.removeEventListener("mousemove", editInternalGlobalMouseMove);
                    document.removeEventListener("mouseout", editInternalGlobalMouseOut);
                    document.removeEventListener("mouseup", editInternalGlobalMouseUp);
                } // If the mouse is moved out of the element's boundaries, remove event listeners related to dragging to ensure they don't interfere with the functionality above
            }
            function editInternalGlobalMouseUp(ev) {
                document.removeEventListener("mousemove", editInternalGlobalMouseMove);
                document.removeEventListener("mouseout", editInternalGlobalMouseOut);
                document.removeEventListener("mouseup", editInternalGlobalMouseUp);
                drag.style.display = null;
                drag.style.left = null;
                drag.style.top = null;
                drag.style.opacity = null; // If the mouse is released, remove event listeners related to dragging and return the drag element to it's original state
            }
            document.addEventListener("mousemove", editInternalGlobalMouseMove);
            document.addEventListener("mouseout", editInternalGlobalMouseOut);
            document.addEventListener("mouseup", editInternalGlobalMouseUp);
        });
    });
}