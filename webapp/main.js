/**
 * Author: Matthew MT
 * Date: 03/28/2020
 * Notes:
 * The following code is a bit rushed and convoluted at the same time, but works.
 */

const
    elements = [
        "<div class=\"zone-element\"><div>Hi, I'm an element, and so are the ones beside me.</div></div>",
        "<div class=\"zone-element\"><div>You can drag us around to change our order.</div></div>",
        "<div class=\"zone-element\"><div>You could also delete some of us...</div></div>",
        "<div class=\"zone-element\"><div>Or edit an element or two...</div></div>",
        "<div class=\"zone-element\"><div>Or drag new elements over from the palette up top.</div></div>"
    ],
    main = $("main-zone"),
    drag = $("drag");

function forEachElem(elemQuery, callback) {
    document.querySelectorAll(elemQuery).forEach(callback);
}

function $(id) { // NOT JQUERY
    return document.getElementById(id);
}

function zElem(text) {
    return "<div class=\"zone-element\"><div>" + text + "</div></div>";
}

/**
 * Checks whether the position is contained within the element.
 * Used in this program to run this check on the cursor.
 */
function contains(x, y, elem) {
    return (x > elem.offsetLeft && y > elem.offsetTop && x < elem.offsetLeft + elem.offsetWidth && y < elem.offsetTop + elem.offsetHeight);
}

/**
 * Calculates the index the element the mouse would be closest to hovering over inside the main block.
 */
function getElemPos(mouseX, mouseY) {
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
function update(event) {
    let containedInMain = contains(event.clientX, event.clientY, main);
    if (holdStatus.next().value && containedInMain) {
        let calcedPos = getElemPos(event.clientX, event.clientY);

        if (newOrCur.next().value == -1) {
            newOrCur.next(calcedPos);
            elements.splice(calcedPos, 0, zElem($("drag").textContent)); // Adds the ghost element if the cursor was just dragged over main
            main.style.height = null;
        } else {
            let pos = newOrCur.next().value;
            if (calcedPos != pos) {
                newOrCur.next(calcedPos);
                elements.splice(calcedPos, 0, ...elements.splice(pos, 1)); // This keeps all elements other than the ghost element in the order they were in when the ghost element was created
            }
        }
    
        main.innerHTML = elements.join("\n");
        main.children[calcedPos].style["background-color"] = "#aaaacc";
        main.children[calcedPos].firstChild.style.color = "#666666"; // These lines make the ghost element stand out
    } else if (!containedInMain) {
        if (newOrCur.next().value != -1) {
            elements.splice(newOrCur.next().value, 1); // Allows the deletion of an element by dragging it away from main
            newOrCur.next(-1);
            main.innerHTML = elements.join("\n");
            if (!elements.length) main.style.height = "10.65rem"; // Main stays at least high enough for one element when there are no elements
        }
    }
}

/**
 * Returns a function that, when called, makes the given element draggable within main by the user.
 */
function dragElem(elem, addNew) {
    return function (ev) {
        ev.preventDefault();
        let
            pos = [0, 0, ev.clientX, ev.clientY];
        if (addNew) newOrCur.next(-1);
        else newOrCur.next(getElemPos(pos[2], pos[3]));
        drag.style.display = "flex";
        drag.style.left = elem.offsetLeft + "px";
        drag.style.top = elem.offsetTop + "px";
        drag.firstChild.textContent = elem.textContent; // These lines update the invisible "drag" div to appear at the cursor's location
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
        function dragInternalMouseUp(e) {
            e.preventDefault();
            document.removeEventListener("mousemove", update);
            document.removeEventListener("mousemove", dragInternalMove);
            document.removeEventListener("mouseup", dragInternalMouseUp);
            drag.style.display = null;
            drag.style.left = null;
            drag.style.top = null;
            drag.firstChild.textContent = null;

            if (holdStatus.next().value) holdStatus.next(true);
            forEachElem(".zone-element", (elem) => {
                elem.style["background-color"] = null;
                elem.firstChild.style.color = null;
            });
            makeEditable(".zone-element");
            newOrCur.next(-1); // When the mouse is released, re-initialize all elements with their proper functionality and style
        }

        document.addEventListener("mousemove", update);
        document.addEventListener("mousemove", dragInternalMove);
        document.addEventListener("mouseup", dragInternalMouseUp);
    }
}

function makeDraggable(query, addNew = false) {
    forEachElem(query, (elem) => {
        elem.addEventListener("mousedown", dragElem(elem, addNew));
    });
}

function makeEditable(query) {
    forEachElem(query, (elem) => {
        function editInternalMouseOver(event) {
            let
                temp = elem.innerHTML,
                text = elem.textContent;
            elem.innerHTML = "<textarea class=\"element-edit\">" + text + "</textarea>";

            function returnNormal() {
                let val = elem.firstChild.value;
                elem.innerHTML = temp;
                elem.firstChild.textContent = val;
                elements[Object.values(elem.parentElement.children).indexOf(elem)] = zElem(val); // More one-liner code, I know
            }
            function eventReturnNormal() {
                returnNormal();
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
            let tempDrag = dragElem(elem, false);
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




window.addEventListener("load", (event) => {
    main.innerHTML = elements.join("\n");
    makeDraggable(".new-zone-element", true);
    makeEditable(".zone-element");
});