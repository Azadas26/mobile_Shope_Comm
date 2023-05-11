var mongoClient = require('mongodb').MongoClient
var Promise = require('promise')

var state =
{
    db: null
}

module.exports =
{
    Databse_Connection: () => {
        var dbname = "Mobile_Community"
        return new Promise((resolve, reject) => {
            mongoClient.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, data) => {
                if (err) {
                    reject("DataBase Connection Error...")
                }
                else {
                    state.db = data.db(dbname)
                    resolve("DataBase Connection Success....")
                }
            })
        })
    },
    get: () => {
        return state.db;
    }
}