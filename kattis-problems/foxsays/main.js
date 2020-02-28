/**
 * Author: Matthew MT
 * Date: 2/17/20
 * Notes:
 * In order to be accepted by Kattis, the program has to proactively read from stdin rather than wait for a line to be fed to it.
 * Thus, after some web searches, I came across the solution below.
 */

const
    assert = require("assert").strict,
    fs = require("fs"),
    data = fs.readFileSync(0, "utf-8").split("\n"); // This reads all the data from stdin and splits at newlines in order to be read by the program

function answer(noises, animals) {
    return noises.split(" ").filter(v => !animals.includes(v)).join(" "); // Calculating the answer only requires a few short lines of code due to how flexible JavaScript is
}

function test() {
    assert.strictEqual(answer("yip yip bow wa ho ho ni", ["yip", "bow", "ni"]), "wa ho ho");
    assert.strictEqual(answer("pa pow bow wow pow ni chirp caw wa", ["bow", "wow", "ni", "chirp", "caw"]), "pa pow pow wa");
    assert.strictEqual(answer("pow chirp pa bow wow wa caw wa chirp pa", ["chirp", "bow", "wow", "caw"]), "pow pa wa wa pa");
    console.log("All test cases passed.");
    process.exit(); // Ends program
}

function compute() {
    let num = +data.shift();
    for (let i = 0; i < num; i++) {
        let
            noises = data.shift(),
            animals = [],
            line;
        while ((line = data.shift().trim()) != "what does the fox say?") animals.push(line.split(" ")[2]);
        console.log(answer(noises, animals));
    }
    process.exit();
}

;(() => {
    if (process.argv.length > 2 && process.argv[2] == "test") test();
    else compute();
})();