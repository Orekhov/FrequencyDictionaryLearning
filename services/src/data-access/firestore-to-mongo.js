const Firestore = require('@google-cloud/firestore');
// Docs at https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
const fs = require('fs-extra');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoConnectionUrl = require('../../mongoConnectionUrl.json').url;
const dbName = 'NDDB';

let client;

const serviceAccountKeyJsonPath = "serviceAccountKey.json"
let db;

async function initFirestore() {
    const resolvedFilePath = path.resolve(serviceAccountKeyJsonPath);
    const serviceAccountKeyJson = await fs.readJson(resolvedFilePath);
    db = new Firestore({
        projectId: serviceAccountKeyJson.project_id,
        keyFilename: resolvedFilePath,
    });
}

async function initMongo() {
    client = new MongoClient(mongoConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function (err) {
        if (err) {
            throw err;
        }
        // client.close(); // should it be closed ever?
    });
}

async function init() {
    await initFirestore();
    await initMongo();
}

async function runExport() {
    try {
        // const uc = await getNgramCollection('unigrams');
        // await uploadCollection('unigrams', uc);
        // const bc = await getNgramCollection('bigrams');
        // await uploadCollection('bigrams', bc);
        // const tc = await getNgramCollection('trigrams');
        // await uploadCollection('trigrams', tc);
        const sc = await getSourceCollection('sources');
        await uploadCollection('sources', sc);
    } catch (error) {
        console.error('Error during export');
        console.error(error);
    }
}

async function getNgramCollection(collectionId) {
    console.log(`Starting getting data for ${collectionId}`)
    const collection = db.collection(collectionId);
    let snapshot = await collection
        .limit(50000)
        .get();

    let ngrams = [];
    snapshot.forEach(doc => {
        ngrams.push(convertNgramToReturnType(doc.data()));
    });
    console.log(`Got data for ${collectionId}`);
    console.log(`Collection length: ${ngrams.length}`);
    return ngrams;
}

async function getSourceCollection(collectionId) {
    console.log(`Starting getting data for ${collectionId}`)
    const collection = db.collection(collectionId);
    let snapshot = await collection
        .limit(50000)
        .get();

    let ngrams = [];
    snapshot.forEach(doc => {
        ngrams.push(convertSourceToReturnType(doc.data()));
    });
    console.log(`Got data for ${collectionId}`);
    console.log(`Collection length: ${ngrams.length}`);
    return ngrams;
}

async function uploadCollection(collectionId, collectionData) {
    console.log(`Starting inserting for ${collectionId}`)
    const db = client.db(dbName);
    const collection = db.collection(collectionId);
    await collection.insertMany(collectionData);
    console.log(`Inserted for ${collectionId}`)
}

function convertNgramToReturnType(dbDoc) {
    return {
        ...dbDoc,
        updated: dbDoc.updated.toDate()
    };
}

function convertSourceToReturnType(dbDoc) {
    return {
        ...dbDoc,
        added: dbDoc.added.toDate()
    };
}

module.exports = {
    init: init,
    runExport: runExport
}
