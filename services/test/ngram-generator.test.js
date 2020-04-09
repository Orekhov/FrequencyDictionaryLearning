const assert = require('assert');
const ngramGenerator = require('../src/services/ngram-generator');
const testCases = require('./ngram-generator.testCases');

describe('NgramGenerator', function () {
    describe('#generateAllNgrams()', function () {
        testCases.generateAllNgramsTestCases.forEach((testCase, index) => {
            it(`test case ${index + 1}`, function () {
                const result = ngramGenerator.generateAllNgrams(testCase.text);

                const actualUnigrams = result.unigrams;
                const expectedUnigrams = testCase.expectedUnigrams;
                assert.deepStrictEqual(actualUnigrams, expectedUnigrams);

                const actualBigrams = result.bigrams;
                const expectedBigrams = testCase.expectedBigrams;
                assert.deepStrictEqual(actualBigrams, expectedBigrams);

                const actualTrigrams = result.trigrams;
                const expectedTrigrams = testCase.expectedTrigrams;
                assert.deepStrictEqual(actualTrigrams, expectedTrigrams);
            });
        });
    });
});