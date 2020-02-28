/**
 * Author: Matthew MT
 * Date: 2/17/20
 * Notes:
 * None, see "foxsays/main.js".
 */

const
    assert = require("assert").strict,
    fs = require("fs");
    data = fs.readFileSync(0, "utf-8").split("\n");

function answer(nums) {
    let
        sorted = [],
        found;
    for (let num of nums) {
        found = sorted.find(v => v.n == num);
        if (found) found.c++;
        else sorted.push({n: num, c: 1});
    }
    return sorted.sort((a, b) => b.c < a.c ? -1 : 1).map(v => Array(v.c).fill(v.n, 0, v.c).join(" ")).join(" "); // Sorts and then constructs the final string representing the "sorted" numbers
}

function test() {
    assert.strictEqual(answer(["4", "3", "4", "4", "5", "3", "5"]), "4 4 4 3 3 5 5");
    assert.strictEqual(answer(["2", "3", "0", "3"]), "3 3 2 0");
    assert.strictEqual(answer(["1", "1", "2", "4", "2", "3", "4"]), "1 1 2 2 4 4 3");
    console.log("All test cases passed.");
    process.exit();
}

function compute() {
    data.shift(); // Because of the way JavaScript reads stdin, we can discard the first given line
    console.log(answer(data.shift().trim().split(" ")));
}

;(() => {
    if (process.argv.length > 2 && process.argv[2] == "test") test();
    else compute();
})();