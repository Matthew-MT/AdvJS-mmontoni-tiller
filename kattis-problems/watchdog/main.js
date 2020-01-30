const assert = require("assert").strict;

;(function loop() {
    process.stdin.once("data", (num) => {
        for (let i = 0; i < num; i++) process.stdin.once("data", (line) => {
            const [roof, numHatches] = line.split(" ").map(v => parseInt(v));
            let hatchPos = [];
            for (let i = 0; i < numHatches; i++) process.stdin.once("data", (hatch) => {
                let pos = hatch.split(" ").map(v => parseInt(v));
                hatchPos.push({x: pos[0], y: pos[1]});
            });
        });
    });
})();