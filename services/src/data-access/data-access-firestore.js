const Firestore = require('@google-cloud/firestore');
const fs = require('fs-extra');
const path = require('path');

const serviceAccountKeyJsonPath = "serviceAccountKey.json"
let db;

async function init() {
    const resolvedFilePath = path.resolve(serviceAccountKeyJsonPath);
    const serviceAccountKeyJson = await fs.readJson(resolvedFilePath);
    db = new Firestore({
        projectId: serviceAccountKeyJson.project_id,
        keyFilename: resolvedFilePath,
    });
}

function insertUnigram(unigram) {
    console.log('not implemented');
}

async function getNgrams(params) {
    const { userId, language, nGramType, limit, known } = params;
    const collectionName = getCollectionName(userId, language, nGramType);
    const collection = db.collection(collectionName);
    let snapshot = await collection
        .where('user', '==', userId)
        .where('lang', '==', language)
        .where('known', '==', known)
        .orderBy('totalCount', 'desc')
        .limit(limit)
        .get();

    let unigrams = [];
    snapshot.forEach(doc => {
        unigrams.push(convertToReturnType(doc.data()));
    });
    return unigrams;
}

function getCollectionName(userId, language, nGramType) {
    const supportedTypes = ['unigrams', 'bigrams', 'trigrams'];
    if(supportedTypes.includes(nGramType)) {
        return nGramType;
    } else {
        throw `${nGramType} is not a valid collection name`;
    }
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram,
    getNgrams: getNgrams
}

function convertToReturnType(dbDoc) {
    return {
        item: dbDoc.item,
        totalCount: dbDoc.totalCount,
        known: dbDoc.known,
        updated: dbDoc.updated.toDate(),
        counts: dbDoc.counts
    }
}