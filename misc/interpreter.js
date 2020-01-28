//const assert = require("assert").strict;

const interpreter = {
    dequote: function (s) {
        let t = (s[0] == "\"" || s[0] == "'" ? s.slice(1, s.length) : s);
        return (t[t.length - 1] == "\"" || t[t.length - 1] == "'" ? t.slice(0, t.length - 1) : t);
    },
    exec: function (code) {},
    /*structure: {
        "(": function (s) {
            for (let i = 0; i < s.length; i++) {
                if (interpreter.structure[s[i]]) s = interpreter.structure[s[i]](s.slice(i + 1, s.length)), i = 0;
                else if (s[i] == ")") return interpreter.statement(s.slice(0, i - 1)) + s.slice(i + 1, s.length);
            }
        }
    },*/
    statement: function (s) {

    },
    statements: {
        independent: [
            {
                name: "set",
                fnc: (name, vars) => val => vars[interpreter.dequote(name)] = val,
                args: 2,
                middle: [
                    "to"
                ],
                opt: [
                    [["variable"], ["the", "variable"]]
                ]
            }
        ],
        dependent: [
            {
                name: "times",
                fnc: a => b => a * b,
                args: 2,
                opt: []
            },
            {
                name: "divide",
                fnc: a => b => a / b,
                args: 2,
                opt: [
                    [["\\$d", "by"]]
                ]
            },
            {
                name: "minus",
                fnc: a => b => a - b,
                args: 2,
                opt: []
            },
            {
                name: "plus",
                fnc: a => b => a + b,
                args: 2,
                opt: []
            }
        ]
    }
};

module.exports = interpreter;