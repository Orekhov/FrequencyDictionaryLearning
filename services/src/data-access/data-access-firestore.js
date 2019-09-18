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

function insertUnigram (unigram) {
    console.log('not implemented');
}

async function getUnigrams (limit = 10) {
    const collection = db.collection('unigrams');
    let snapshot = await collection.orderBy('totalCount', 'desc').limit(limit).get();

    let unigrams = [];
    snapshot.forEach(doc => {
        unigrams.push(convertToReturnType(doc.data()));
      });
    return unigrams;
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram,
    getUnigrams: getUnigrams
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