const assert = require("assert").strict;

function compute() {
    process.stdin.once("data", (numS) => {
        let num = parseInt(numS);
        for (let i = 0; i < num; i++) process.stdin.once("data", (noises) => {
            let animals = [], end = false;
            while (!end) process.stdin.once("data", (line) => {
                if (line != "what does the fox say?") animals.push(line.split(" ")[2]);
                else end = true;
            });
            console.log(noises.split(" ").filter(v => !animals.includes(v)).join(" "));
        });
    });
}