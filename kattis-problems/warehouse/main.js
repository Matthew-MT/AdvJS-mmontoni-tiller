/**
 * Author: Matthew MT
 * Date: 2/17/20
 * Notes:
 * None, see "foxsays/main.js".
 */

const
    assert = require("assert").strict,
    fs = require("fs"),
    data = fs.readFileSync(0, "utf-8").split("\n");

function answer(toyArray) {
    let finalSet = {};
    for (let shipment of toyArray) {
        let [toy, num] = shipment.split(" ");
        if (toy in finalSet) finalSet[toy] += +num; // "if (toy in finalSet) ..." checks whether the index exists
        else finalSet[toy] = +num;
    }
    return Object.keys(finalSet).sort((a, b) => {
        let res = finalSet[b] - finalSet[a];
        if (res == 0) return a < b ? -1 : 1;
        else return res;
    }).map(k => k + " " + finalSet[k]); // This may seem a little convoluted - but it's just a quick way to sort by number of toys first, then by alphabetical order second
}

function test() {
    assert.strictEqual(answer(["mytoy 3", "toytwo 2", "awesomerobot 5", "toytwo 4"]).join("\n"), "toytwo 6\nawesomerobot 5\nmytoy 3");
    assert.strictEqual(answer(["supercar 2", "spinningtop 10", "racetrack 1", "racetrack 4", "supercar 0"]).join("\n"), "spinningtop 10\nracetrack 5\nsupercar 2");
    assert.strictEqual(answer(["ferretballblue 2", "ferretballred 2", "ferretballgreen 3"]).join("\n"), "ferretballgreen 3\nferretballblue 2\nferretballred 2");
    console.log("All test cases passed.");
    process.exit();
}

function compute() {
    let tests = +data.shift(); // The "+" in front of "data.shift()" is shorthand notation for converting a string to a number
    for (let i = 0; i < tests; i++) {
        let
            shipments = +data.shift(),
            toyArray = [];
        for (let j = 0; j < shipments; j++) toyArray.push(data.shift());
        let ans = answer(toyArray);
        console.log(ans.length + "\n" + ans.join("\n"));
    }
    process.exit();
}

;(() => {
    if (process.argv.length > 2 && process.argv[2] == "test") test();
    else compute();
})();