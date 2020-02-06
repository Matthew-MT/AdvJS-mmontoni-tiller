const
    assert = require("assert").strict,
    readline = require("readline"),
    rl = readline.createInterface(process.stdin);

function test() {
    assert.strictEqual(answer("yip yip bow wa ho ho ni", ["yip", "bow", "ni"]), "wa ho ho");
    assert.strictEqual(answer("pa pow bow wow pow ni chirp caw wa", ["bow", "wow", "ni", "chirp", "caw"]), "pa pow pow wa");
    assert.strictEqual(answer("pow chirp pa bow wow wa caw wa chirp pa", ["chirp", "bow", "wow", "caw"]), "pow pa wa wa pa");
    console.log("All test cases passed.");
}

function sync(stream) {
    return new Promise((resolve) => {
        stream.once("line", resolve);
    });
}

function compute() {
    rl.once("line", async (numS) => {
        let num = parseInt(numS);
        for (let i = 0; i < num; i++) {
            let
                noises = await sync(rl),
                animals = [],
                line;
            while ((line = await sync(rl)) != "what does the fox say?") animals.push(line.split(" ")[2]);
            console.log(answer(noises, animals));
        }
    });
}

function answer(noises, animals) {
    return noises.split(" ").filter(v => !animals.includes(v)).join(" ");
}

;(() => {
    if (process.argv.length > 2 && process.argv[2] == "test") test();
    else compute();
})();