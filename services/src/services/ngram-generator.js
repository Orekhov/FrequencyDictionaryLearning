const tokenizer = require('./tokenizer');

function generateUnigrams(allTokens) {
    const unigramsMap = new Map();
    const cleanupToken = token => token.endsWith('-') || token.endsWith(',') ? token.slice(0, -1) : token;
    allTokens.forEach(tokensForASentence => {
        tokensForASentence.forEach(token => {
            const unigram = cleanupToken(token[0]);
            if (unigramsMap.has(unigram)) {
                unigramsMap.set(unigram, unigramsMap.get(unigram) + 1);
            } else {
                unigramsMap.set(unigram, 1);
            }
        });
    });
    return unigramsMap;
}

function generateNgrams(allTokens, n) {
    const cleanupNgram = ngram => ngram.endsWith(',') ? ngram.slice(0, -1) : ngram;
    const ngramsMap = new Map();
    allTokens.forEach(tokensForASentence => {
        for (let i = 0; i <= tokensForASentence.length - n; i++) {
            const indexStart = tokensForASentence[i].index;
            const indexEnd = tokensForASentence[i + n - 1].index + tokensForASentence[i + n - 1][0].length;
            const ngramRaw = tokensForASentence[0].input.substring(indexStart, indexEnd);
            const ngram = cleanupNgram(ngramRaw);
            if (ngramsMap.has(ngram)) {
                ngramsMap.set(ngram, ngramsMap.get(ngram) + 1);
            } else {
                ngramsMap.set(ngram, 1);
            }
        }
    });
    return ngramsMap;
}

function generateBigrams(allTokens) {
    return generateNgrams(allTokens, 2);
}

function generateTrigrams(allTokens) {
    return generateNgrams(allTokens, 3);
}

function generateAllNgrams(inputRawString) {
    const allSentences = tokenizer.splitIntoSentences(inputRawString);
    const allTokens = allSentences.map(s => {
        return tokenizer.tokenize(s);
    });
    const unigrams = generateUnigrams(allTokens);
    const bigrams = generateBigrams(allTokens);
    const trigrams = generateTrigrams(allTokens);
    return {
        unigrams,
        bigrams, 
        trigrams, 
        unigramsCount: unigrams.size, 
        bigramsCount: bigrams.size,
        trigramsCount: trigrams.size,
        charLength: inputRawString.length
    };
}

module.exports = {
    generateAllNgrams: generateAllNgrams
}