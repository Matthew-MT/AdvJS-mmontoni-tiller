/**
 * Author: Matthew MT
 * Date: 2/27/20
 * Notes:
 * None, see "foxsays/main.js".
 */

const
    assert = require("assert").strict,
    fs = require("fs");
    data = fs.readFileSync(0, "utf-8").split("\n");

function invert2DArray(a) {
    if (!a[0]) return a;
    let constructed = [];

    for (let i = 0; i < a.length; i++) for (let j = 0; j < a[i].length; j++) {
        if (!constructed[j]) constructed[j] = [];
        constructed[j][i] = a[i][j];
    }
    // Goes through a 2D array and returns an inverted version of it
    return constructed;
}

function answer(strings) {
    return invert2DArray(invert2DArray(strings.map(s => s.trim().split(""))).map(v => v.join("")).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1).map(s => s.split(""))).map(v => v.join(""));
    // This might look a bit convoluted at first, but basically what this line does is it takes the array of rows that are part of the test case,
    // flips them about the line i=j (see "invert2DArray" above), sorts them, and then flips them back again
}

function test() {
    assert.strictEqual(answer(["wtb", "are", "lae", "lmp"]).join("\n"), "btw\nera\neal\npml");
    assert.strictEqual(answer(["fye", "eem", "epu"]).join("\n"), "efy\nmee\nuep");
    assert.strictEqual(answer(["spsn", "eauo", "arnw"]).join("\n"), "npss\noaeu\nwran");
    console.log("All test cases passed.");
    process.exit();
}

function compute() {
    let t, h;
    while ((t = data.shift().trim().split(" ")) && (h = +(t[0]))) console.log(answer(data.splice(0, h)).join("\n") + "\n");
    // This line iterates through each test case
}

;(() => {
    if (process.argv.length > 2 && process.argv[2] == "test") test();
    else compute();
})();