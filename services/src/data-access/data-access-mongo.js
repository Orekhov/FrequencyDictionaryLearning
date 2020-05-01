const MongoClient = require('mongodb').MongoClient;
// Docs: https://docs.mongodb.com/drivers/node/
const ObjectID = require('mongodb').ObjectID;
const mongoConnectionUrl = require('../../mongoConnectionUrl.json').url;
const shared = require('./shared');
const translator = require('./translator');

const dbName = 'NDDB';
let client;

async function init() {
    client = new MongoClient(mongoConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function (err) {
        if (err) {
            throw err;
        }
        // client.close(); // should it be closed ever?
    });
}

async function insertUnigram(unigram) {
    try {
        const collection = getCollection('unigrams');
        await collection.insertOne(unigram);
    } catch (error) {
        console.log(error);
    }
}

async function getNgrams(params) {
    const { userId, language, nGramType, limit, known } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);
    const query = {
        user: userId,
        lang: language,
        known: known
    };
    const sort = {
        totalCount: -1
    };
    const ngrams = await collection
        .find(query)
        .sort(sort)
        .limit(limit)
        .toArray();
    ngrams.forEach(n => {
        n.id = n._id;
        delete n._id;
    });
    return ngrams;
}

async function getNgramDetail(params) {
    const { userId, nGramType, id } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);
    const lookup = {
        from: "sources",
        let: { sn: "$counts.s", u: "$user" },
        pipeline: [{
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$user", "$$u"] },
                        { $eq: ["$sourceNumber", "$$sn"] },
                    ]
                }
            }
        }, {
            $project: { _id: 0, description: 1 }
        }],
        as: "desc"
    }
    const group = {
        _id: "$_id",
        id: { $first: "$_id" },
        user: { $first: "$user" },
        updated: { $first: "$updated" },
        totalCount: { $first: "$totalCount" },
        lang: { $first: "$lang" },
        known: { $first: "$known" },
        item: { $first: "$item" },
        counts: { $push:  { count: "$counts.c", source: "$counts.s", sourceDescription: "$desc.description" } }
    }
    const ngram = await collection
        .aggregate([
            { $match: { _id: ObjectID(id) } },
            { $unwind: "$counts" },
            { $lookup: lookup },
            { $unwind: "$desc" },
            { $group: group }
        ])
        .next();

    shared.validateUserIsAuthorized(ngram, userId);
    await extendWithTranslations(ngram)
    return ngram;
}

async function extendWithTranslations(ngram) {
    ngram.translations = await translator.translateText(ngram.item);
}

async function startUploadingNgrams() {
    throw "Not implemented";
}

async function setNgramKnownState(params) {
    const { userId, nGramType, id, known } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);

    const filter = { _id: ObjectID(id) };
    const update = { $set: { known: known }};
    await collection.updateOne(filter, update);
}

function getCollection(collectionName) {
    return getDb().collection(collectionName);
}

function getDb() {
    return client.db(dbName);
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram,
    getNgrams: getNgrams,
    getNgramDetail: getNgramDetail,
    startUploadingNgrams: startUploadingNgrams,
    setNgramKnownState: setNgramKnownState
}