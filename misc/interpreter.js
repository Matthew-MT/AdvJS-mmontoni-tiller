interpreter = {
    exec: function (code) {},
    structure: {
        "(": function (s) {
            for (let i = 0; i < s.length; i++) {
                if (interpreter.structure[s[i]]) s = interpreter.structure[s[i]](s.slice(i + 1, s.length)), i = 0;
                else if (s[i] == ")") return interpreter.statement(s.slice(0, i - 1)) + s.slice(i + 1, s.length);
            }
        }
    },
    statement: function (s) {},
    statements: [
        {"*": () => ({n: 2, f: (a, b) => a * b})},
        {"/": () => ({n: 2, f: (a, b) => a / b})},
        {"-": () => ({n: 2, f: (a, b) => a - b})},
        {"+": () => ({n: 2, f: (a, b) => a + b})}
    ]
};

module.exports = interpreter;