const
    express = require("express"),
    app = express();

app.listen("/", (req, res) => {
    res.sendFile("client/index.html");
});