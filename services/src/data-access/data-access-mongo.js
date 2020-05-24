const MongoClient = require('mongodb').MongoClient;
// Docs: https://docs.mongodb.com/drivers/node/
// https://docs.mongodb.com/manual/reference/method/js-collection/
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
    const { userId, language, nGramType, limit, known, sources, search } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);
    const query = {
        user: userId,
        lang: language,
        known: known
    };
    if (sources && sources.length > 0) {
        const sourceNumbers = await getSourceNumbers(sources);
        query.counts = {
            $elemMatch: { s: { $in: sourceNumbers } }
        }
    }
    if (search) {
        const searchStringIsValid = /[A-Za-zæøåÆØÅäÄöÖüÜ]+/.test(search);
        if (!searchStringIsValid) {
            return [];
        }

        query.item = {
            $regex: search
        }
    }
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

async function getSourceNumbers(sourceIds) {
    const objectIds = sourceIds.map(sourceId => ObjectID(sourceId));
    const collection = getCollection("sources");
    const sourceNumbers = await collection.aggregate([
        {
            $match: { _id: { $in: objectIds } }
        },
        {
            $project: { _id: 0, sourceNumber: 1 }
        }
    ]).toArray();
    const sourceNumbersArray = sourceNumbers.map(o => o.sourceNumber);
    return sourceNumbersArray
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
        counts: { $push: { count: "$counts.c", source: "$counts.s", sourceDescription: "$desc.description" } }
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

async function startUploadingNgrams(params) {
    const { allNgrams, sourceName, lang, userId } = params;
    const { unigrams, bigrams, trigrams, unigramsCount, bigramsCount, trigramsCount, charLength } = allNgrams;

    const newSourceNumber = await getNewSourceNumber();

    // TODO: check that no id with same number
    // TODO: throttle uploads

    const sourceIdentityDbData = {
        unigramsCount,
        bigramsCount,
        trigramsCount,
        description: sourceName,
        charLength,
        lang,
        sourceNumber: newSourceNumber,
        user: userId,
        added: dateNow()
    }

    await uploadNewSourceIdentity(sourceIdentityDbData);

    await uploadAllNgrams({
        userId, language: lang, allNgrams, sourceNumber: newSourceNumber
    });

}

async function getNewSourceNumber() {
    const collection = getCollection('sources');
    const latest = await collection.findOne({}, { sort: { sourceNumber: -1 } });
    const existingHighestId = latest.sourceNumber;
    return existingHighestId + 1;
}

async function uploadNewSourceIdentity(sourceIdentityDbData) {
    const collection = getCollection('sources');
    const res = await collection.insertOne(sourceIdentityDbData);
    const newId = res.insertedId.toString();
    return newId;
}

async function uploadAllNgrams(params) {
    const { userId, language, allNgrams, sourceNumber } = params;
    const { unigrams, bigrams, trigrams, unigramsCount, bigramsCount, trigramsCount, charLength } = allNgrams;

    await uploadNGrams({
        nGramType: 'unigrams',
        nGrams: unigrams,
        userId,
        language,
        sourceNumber
    });
    await uploadNGrams({
        nGramType: 'bigrams',
        nGrams: bigrams,
        userId,
        language,
        sourceNumber
    });
    await uploadNGrams({
        nGramType: 'trigrams',
        nGrams: trigrams,
        userId,
        language,
        sourceNumber
    });
}

async function uploadNGrams(params) {
    const { nGramType, nGrams, userId, language, sourceNumber } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);

    const mongoOperations = [];
    for (var [key, value] of nGrams) {
        const operation = {
            updateOne: {
                filter: {
                    item: key,
                    user: userId,
                    lang: language
                },
                update: {
                    $setOnInsert: { item: key },
                    $setOnInsert: { user: userId },
                    $setOnInsert: { lang: language },
                    $set: { known: false },
                    $set: { updated: dateNow() },
                    $push: { counts: { s: sourceNumber, c: value } }
                },
                upsert: true
            }
        };
        mongoOperations.push(operation);
    }

    await collection.bulkWrite(mongoOperations);

    const pipeline = [
        {
            $match: {
                user: { $eq: userId },
                lang: { $eq: language }
            }
        },
        {
            $project: {
                totalCount: {
                    $reduce: {
                        input: "$counts",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this.c"], }
                    }
                }
            }
        }
    ]

    const allTotalCounts = await collection.aggregate(pipeline).toArray();

    const updateCountOperations = [];
    allTotalCounts.forEach(tc => {
        const operation = {
            updateOne: {
                filter: { _id: ObjectID(tc._id) },
                update: {
                    $set: { totalCount: tc.totalCount }
                },
                upsert: true
            }
        };
        updateCountOperations.push(operation);
    })

    await collection.bulkWrite(updateCountOperations);
}

// TODO: figure out why performance of this method is much worse despite one 1 round-trip to the server
async function uploadNGrams_AlternativeApproach(params) {
    const { nGramType, nGrams, userId, language, sourceNumber } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);

    const mongoOperations = [];
    for (var [key, value] of nGrams) {
        const operation = {
            updateOne: {
                filter: {
                    item: key,
                    user: userId,
                    lang: language
                },
                update: [{
                    $set: {
                        counts: {
                            $cond: {
                                if: { $isArray: "$counts" },
                                then: { $concatArrays: ["$counts", [{ s: sourceNumber, c: value }]] },
                                else: [{ s: sourceNumber, c: value }]
                            }
                        }
                    }
                }, {
                    $set: {
                        item: key,
                        user: userId,
                        lang: language,
                        known: false,
                        updated: dateNow(),
                        totalCount: {
                            $reduce: {
                                input: "$counts",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.c"], }
                            }
                        }
                    },
                }],
                upsert: true
            }
        };
        mongoOperations.push(operation);
    }

    await collection.bulkWrite(mongoOperations);
}

async function setNgramKnownState(params) {
    const { userId, nGramType, id, known } = params;
    const collectionName = shared.getCollectionName(nGramType);
    const collection = getCollection(collectionName);

    const filter = { _id: ObjectID(id) };
    const update = { $set: { known: known } };
    await collection.updateOne(filter, update);
}

async function getSources(params) {
    const { userId, language } = params;
    const collection = getCollection('sources');
    const sources = await collection.find({
        user: userId,
        lang: language
    }).toArray();
    return sources.map(s => ({
        id: s._id.toString(),
        description: s.description
    }));
}

async function getSourceStats(params) {
    const { userId, sourceNumber } = params;
    const collection = getCollection('unigrams');
    const match = {
        $match: {
            "user": { $eq: userId },
            "counts.s": sourceNumber
        }
    };
    const getCorrectCount = {
        input: "$counts",
        initialValue: 0,
        in: { $add: ["$$value", { $cond: { if: { $eq: ["$$this.s", sourceNumber] }, then: "$$this.c", else: 0 } }] }
    }
    const group = {
        $group: {
            _id: "$count",
            uniqueCountTotal: { $sum: 1 },
            uniqueCountKnown: { $sum: { $cond: { if: { $eq: ["$known", true] }, then: 1, else: 0 } } },
            uniqueCountUnknown: { $sum: { $cond: { if: { $eq: ["$known", true] }, then: 0, else: 1 } } },
            frequencyCountKnown: {
                $sum: {
                    $cond: {
                        if: {
                            $eq: ["$known", true]
                        },
                        then: {
                            $reduce: getCorrectCount
                        },
                        else: 0
                    }
                }
            },
            frequencyCountUnknown: {
                $sum: {
                    $cond: {
                        if: {
                            $eq: ["$known", true]
                        },
                        then: 0,
                        else: {
                            $reduce: getCorrectCount
                        }
                    }
                }
            }
        }
    };
    const sourceStats = await collection.aggregate([
        match,
        group
    ]).next();

    sourceStats.uniqueCountKnownPct = (sourceStats.uniqueCountKnown / sourceStats.uniqueCountTotal) * 100;
    sourceStats.uniqueCountUnknownPct = (sourceStats.uniqueCountUnknown / sourceStats.uniqueCountTotal) * 100;
    sourceStats.frequencyCountTotal = sourceStats.frequencyCountKnown + sourceStats.frequencyCountUnknown;
    sourceStats.frequencyCountKnownPct = (sourceStats.frequencyCountKnown / sourceStats.frequencyCountTotal) * 100;
    sourceStats.frequencyCountUnknownPct = (sourceStats.frequencyCountUnknown / sourceStats.frequencyCountTotal) * 100;

    return sourceStats;
}

function getCollection(collectionName) {
    return getDb().collection(collectionName);
}

function getDb() {
    return client.db(dbName);
}

function dateNow() {
    return new Date(Date.now());
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram,
    getNgrams: getNgrams,
    getNgramDetail: getNgramDetail,
    startUploadingNgrams: startUploadingNgrams,
    setNgramKnownState: setNgramKnownState,
    getSources: getSources,
    getSourceStats: getSourceStats
}