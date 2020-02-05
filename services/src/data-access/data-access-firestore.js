const Firestore = require('@google-cloud/firestore');
// Docs at https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
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
    const collectionName = getCollectionName(nGramType);
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
        unigrams.push(convertToReturnType(doc.id, doc.data()));
    });
    return unigrams;
}

async function getNgramDetail(params) {
    const { userId, nGramType, id } = params;
    const collectionName = getCollectionName(nGramType);
    const doc = await db.doc(`${collectionName}/${id}`).get();
    const docData = doc.data();
    if(docData.user !== userId) {
        throw "Not authorized to access";
    }
    const valueToReturn = {
        id: id,
        item: docData.item,
        totalCount: docData.totalCount,
        known: docData.known,
        updated: docData.updated.toDate(),
        counts: []
    };
    await getSourceDescriptions(userId, docData.counts, valueToReturn);
    return valueToReturn;
}

async function getSourceDescriptions(userId, docDataCounts, valueToReturn) {
    const promises = docDataCounts.map(async count => {
        const description = await getSourceDescription(userId, count.s);
        valueToReturn.counts.push({
            source: count.s,
            count: count.c,
            sourceDescription: description
        });
      })
      await Promise.all(promises)
}

async function getSourceDescription(userId, sourceNumber) {
    const collection = db.collection('sources');
    let snapshot = await collection
        .where('user', '==', userId)
        .where('sourceNumber', '==', sourceNumber)
        .limit(1)
        .get();
    const data = snapshot.docs[0].data();
    return data.description;
}

async function startUploadingNgrams(params) {
    const { allNgrams, sourceName, lang, userId } = params;
    const { unigrams, bigrams, trigrams, unigramsCount, bigramsCount, trigramsCount, charLength } = allNgrams;

    const newSourceNumber = await getNewSourceNumber();

    // TODO: check that no id with same number (or no existing upload happening),
    //       otherwise delete and return with error. Concurrent uploads for the same user+lang are not supported.
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
    const sourceIdentityId = await uploadNewSourceIdentity(sourceIdentityDbData);

    const uploadInfoRef = await uploadNewUploadInfo({
        sourceIdentityId,
        totalAmountToUpload: unigramsCount + bigramsCount + trigramsCount,
    });

    uploadNgramsInTheBackground({
        userId, language: lang, allNgrams, sourceNumber: newSourceNumber, uploadInfoRef
    });

    return uploadInfoRef.id;
}

async function getNewSourceNumber() {
    const sourcesRef = getSourcesCollectionRef();
    const fieldName = 'sourceNumber';
    let latest = await sourcesRef.orderBy(fieldName, 'desc').limit(1).get();
    const existingHighestId = latest.docs[0].data()[fieldName];
    return existingHighestId + 1;
}

async function uploadNewSourceIdentity(sourceIdentityDbData) {
    const sourcesRef = getSourcesCollectionRef();
    const ref = await sourcesRef.add(sourceIdentityDbData);
    return ref.id;
}

async function uploadNewUploadInfo(params) {
    const { sourceIdentityId, totalAmountToUpload } = params;
    const uploadsRef = db.collection('uploads');
    const ref = await uploadsRef.add({
        sourceIdentityId,
        totalAmountToUpload,
        uploaded: 0,
        started: dateNow()
    });
    return ref;
}

async function updateUploadInfo(params) {
    const { uploadInfoRef, uploaded } = params;
    await uploadInfoRef.update({ uploaded });
}

async function uploadNgramsInTheBackground(params) {
    const { userId, language, allNgrams, sourceNumber, uploadInfoRef } = params;
    const { unigrams, bigrams, trigrams, unigramsCount, bigramsCount, trigramsCount, charLength } = allNgrams;
    const uploadedUnigramsCount = await uploadNGrams({
        nGramType: 'unigrams',
        nGrams: unigrams,
        userId,
        language,
        sourceNumber,
        alreadyUploadedCount: 0,
        uploadInfoRef
    });
    const uploadedBigramsCount = await uploadNGrams({
        nGramType: 'bigrams',
        nGrams: bigrams,
        userId,
        language,
        sourceNumber,
        alreadyUploadedCount: uploadedUnigramsCount,
        uploadInfoRef
    });
    const uploadedTrigramsCount = await uploadNGrams({
        nGramType: 'trigrams',
        nGrams: trigrams,
        userId,
        language,
        sourceNumber,
        alreadyUploadedCount: uploadedUnigramsCount + uploadedBigramsCount,
        uploadInfoRef
    });
    updateUploadInfo({ uploadInfoRef, uploaded: uploadedUnigramsCount + uploadedBigramsCount + uploadedTrigramsCount }); // no need to await
}

async function uploadNGrams(params) {
    const { nGramType, nGrams, userId, language, sourceNumber, alreadyUploadedCount, uploadInfoRef } = params;
    const collectionName = getCollectionName(nGramType);
    const collectionRef = db.collection(collectionName);
    let uploadedCount = 0;
    const uploadPromises = [];
    for (var [key, value] of nGrams) {
        try {
            const uploadPromise = uploadNGram({
                item: key,
                count: value,
                userId,
                language,
                sourceNumber,
                collectionRef
            }).then(() => {
                uploadedCount += 1;
                if ((alreadyUploadedCount + uploadedCount) % 20 === 0) {
                    const uploaded = alreadyUploadedCount + uploadedCount;
                    updateUploadInfo({ uploadInfoRef, uploaded }); // no need to await
                }
            });
            uploadPromises.push(uploadPromise);
        } catch (error) {
            console.log(error);
        }
    }
    await Promise.all(uploadPromises);
    return uploadedCount;

}

async function uploadNGram(params) {
    const { item, count, userId, language, sourceNumber, collectionRef } = params;
    let existingEntry = await collectionRef
        .where('user', '==', userId)
        .where('lang', '==', language)
        .where('item', '==', item)
        .get();

    if (existingEntry.empty) {
        const newDoc = {
            item,
            counts: [{
                s: sourceNumber,
                c: count
            }],
            known: false,
            lang: language,
            totalCount: count,
            updated: dateNow(),
            user: userId
        };
        await collectionRef.add(newDoc);
    } else {
        const doc = existingEntry.docs[0];
        const docRef = doc.ref;
        const entry = doc.data();
        entry.counts.push({ s: sourceNumber, c: count });
        entry.totalCount += count;
        entry.updated = dateNow();
        await docRef.update(entry);
    }
}

function getCollectionName(nGramType) {
    const supportedTypes = ['unigrams', 'bigrams', 'trigrams'];
    if (supportedTypes.includes(nGramType)) {
        return nGramType;
    } else {
        throw `${nGramType} is not a valid collection name`;
    }
}

function getSourcesCollectionRef() {
    const collectionName = 'sources';
    return db.collection(collectionName);
}

function dateNow() {
    return new Date(Date.now());
}

function convertToReturnType(id, dbDoc) {
    const retVal = {
        id: id,
        item: dbDoc.item,
        totalCount: dbDoc.totalCount,
        known: dbDoc.known,
        updated: dbDoc.updated.toDate(),
        counts: []
    };
    if (dbDoc.counts) {
        dbDoc.counts.forEach(c => retVal.counts.push({
            source: c.s,
            count: c.c
        }));
    }
    return retVal;
}

module.exports = {
    init: init,
    insertUnigram: insertUnigram,
    getNgrams: getNgrams,
    getNgramDetail: getNgramDetail,
    startUploadingNgrams: startUploadingNgrams,
}