const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (cb) => {
    MongoClient.connect("mongodb+srv://jankguy83:OFt6ylk6NiMiEN2w@cluster0-lfrbt.mongodb.net/test?retryWrites=true")
    .then(result => {
        console.log("Connected!");
        db = result.db();
        cb();
    })
    .catch(err => console.log(err));
}

const getDb = function() {
    if(db) {
        return db;
    } else {
        throw new Error("No Db!");
    }
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;