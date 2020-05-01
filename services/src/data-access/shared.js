function getCollectionName(nGramType) {
    const supportedTypes = ['unigrams', 'bigrams', 'trigrams'];
    if (supportedTypes.includes(nGramType)) {
        return nGramType;
    } else {
        throw `${nGramType} is not a valid collection name`;
    }
}

function validateUserIsAuthorized(docData, userId) {
    if (docData.user !== userId) {
        throw "Not authorized to access";
    }
}

module.exports = {
    getCollectionName: getCollectionName,
    validateUserIsAuthorized: validateUserIsAuthorized
}