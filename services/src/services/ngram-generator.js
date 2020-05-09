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
    const isInvalid = token => {
        const atLeastOneDigit = /[0-9]/;
        const digitIsPresent = atLeastOneDigit.test(token);
        return digitIsPresent;
    }
    for (let [key, value] of unigramsMap) {
        if(isInvalid(key)) {
            unigramsMap.delete(key);
        }
    }
    return unigramsMap;
}

function generateNgrams(allTokens, n) {
    const cleanupNgram = ngram => ngram.endsWith(',') ? ngram.slice(0, -1) : ngram;
    const ngramsMap = new Map();
    allTokens.forEach(tokensForASentence => {
        if (tokensForASentence.length >= n) {
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
        }
    });
    const isInvalid = token => {
        const atLeastOneDigit = /[0-9]/;
        const digitIsPresent = atLeastOneDigit.test(token);
        return digitIsPresent;
    }
    for (let [key, value] of ngramsMap) {
        if(isInvalid(key)) {
            ngramsMap.delete(key);
        }
    }
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

    const frequentBigrams = filterFrequent(bigrams, 2);
    const frequentTrigrams = filterFrequent(trigrams, 2);

    const orderedUnigrams = getOrdered(unigrams);
    const orderedBigrams = getOrdered(frequentBigrams);
    const orderedTrigrams = getOrdered(frequentTrigrams);

    return {
        unigrams: orderedUnigrams,
        bigrams: orderedBigrams,
        trigrams: orderedTrigrams,
        unigramsCount: orderedUnigrams.size,
        bigramsCount: orderedBigrams.size,
        trigramsCount: orderedTrigrams.size,
        totalCount: orderedUnigrams.size + orderedBigrams.size + orderedTrigrams.size,
        charLength: inputRawString.length
    };
}

function filterFrequent(map, minimumFrequencyToKeep) {
    return new Map([...map.entries()].filter(e => e[1] >= minimumFrequencyToKeep));
}

function getOrdered(map) {
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

module.exports = {
    generateAllNgrams: generateAllNgrams
}