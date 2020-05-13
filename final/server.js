/**
 * Author: Matthew MT
 * Date: 05/03/2020
 * Notes:
 * This file is the server for this project.
 * To start the server, open the path to this file in terminal and type "node ."
 * Then, open a web browser and enter "localhost:9000"
 */

const
    port = 9000,
    express = require("express"),
    db = require("./mongodb.js"),
    app = express(),
    usernames = [];

app.listen(port, () => {
    console.log("Listening to port " + port);
});

app.use(express.static("client"));
app.use(express.json({limit: "2mb"}));


app.use(express.static("./client"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

app.post("/dynamic/users/profile.json", async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.cart) res.header(400).send({msg: "@incomplete: Cannot process malformed request [1].", data: null});
    let found = await db.findOne(req.body.username);
    if (found) {
        res.header(202).send({msg: "@updated: Data recieved, updating user profile.", data: null});
        await db.updateOne(req.body.username, {cart: req.body.cart});
    } else {
        res.header(201).send({msg: "@created: Data recieved, creating user profile.", data: null});
        await db.insertOne(req.body.username, {cart: req.body.cart});
    }
    next();
});

app.get("/dynamic/users/profile.json", async (req, res, next) => {
    let username = req.query.user;
    if (!username) res.header(400).send({msg: "@incomplete: Cannot process malformed request [2].", data: null});
    let found = await db.findOne(username);
    if (!found) res.header(204).send({msg: "@no_user: No user exists for this username.", data: null});
    else res.header(200).send({msg: "@user_found: User profile contained.", data: found});
});

app.get("/dynamic/util/randomID.json", async (req, res, next) => {
    if (!usernames.length) {
        let found = await db.findOne("username_list");
        if (!found) await db.insertOne("username_list", {"usernames": usernames});
        else usernames.splice(usernames.length, 0, ...found.usernames);
    }
    let username, i = 0;
    while (usernames.includes(username) && i++ < 100) username = Math.floor(Math.random() * 10000) + 1;
    if (usernames.includes(username)) res.header(503).send({msg: "@no_space: Username list is full.", data: null});
    else res.header(200).send({msg: "@new_user: Randomized username contained.", data: username});
});

/*app.get("/static/menu.json", (req, res, next) => {
});*/

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);