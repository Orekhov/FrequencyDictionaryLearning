const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'FDL';
let client;

function init() {
    client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(function(err) {
        if(err) {
            throw err;
        }
        // client.close(); // should it be closed ever?
      });
}

function insertUnigram (unigram) {
    const db = client.db(dbName);
    const collection = db.collection('unigrams');
    collection.insertOne(unigram);
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram
}