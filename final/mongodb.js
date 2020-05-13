const
    pass = "Q5VrDzGv2K9T3Rh1",
    MongoClient = require('mongodb').MongoClient,
    uri = "mongodb+srv://primary_access:" + pass + "@main-lrkzj.mongodb.net/data?retryWrites=true&w=majority";



module.exports = {
    findOne: async function (id) { 
        return new Promise(async (resolve) => {
            const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            client.connect(async (err) => {
                if (err) throw err;
                const collection = client.db("main_db").collection("user_specific");
                let temp = await collection.findOne({id});
                client.close();
                if (temp) delete temp._id;
                resolve(temp);
            });
        });
    },
    insertOne: async function (id, rest) {
        return new Promise(async (resolve, reject) => {
            if (await this.findOne(id)) reject("Image already exists under given ID: " + id);
            else {
                const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                client.connect(async (err) => {
                    if (err) throw err;
                    const collection = client.db("main_db").collection("user_specific");
                    await collection.insertOne({id, ...rest});
                    client.close();
                    resolve();
                });
            }
        });
    },
    updateOne: async function (id, rest) {
        return new Promise(async (resolve, reject) => {
            if (!(await this.findOne(id))) reject("Image not found under given ID: " + id);
            else {
                const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                client.connect(async (err) => {
                    if (err) throw err;
                    const collection = client.db("main_db").collection("user_specific");
                    await collection.updateOne({id}, {$set: rest});
                    client.close();
                    resolve();
                });
            }
        });
    },
    deleteOne: async function (id) {
        return new Promise(async (resolve) => {
            const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            client.connect(async (err) => {
                if (err) throw err;
                const collection = client.db("main_db").collection("user_specific");
                await collection.deleteOne({id});
                client.close();
                resolve();
            });
        });
    },
    clearDB: async function () {
        return new Promise(async (resolve) => {
            const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            client.connect(async (err) => {
                if (err) throw err;
                const collection = client.db("main_db").collection("user_specific");
                await collection.dropIndexes();
                client.close();
                resolve();
            });
        });
    }
};