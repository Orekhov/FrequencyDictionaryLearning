const assert = require('assert');
const tokenizer = require('../src/services/tokenizer');
const testCases = require('./tokenizer.testCases');

describe('Tokenizer', function () {
    describe('#splitIntoSentences()', function () {
        testCases.splitIntoSentencesTestCases.forEach((testCase, index) => {
            it(`test case ${index + 1}`, function () {
                const result = tokenizer.splitIntoSentences(testCase.text);
                const actual = result.length;
                const expected = testCase.sentences;
                assert.equal(actual, testCase.sentences, `ACTUAL: ${actual}. EXPECTED: ${expected}. TEST CASE: ${testCase.text}`);
                if(testCase.sentence1) {
                    const actualFirstSentence = result[0];
                    const expectedFirstSentence = testCase.sentence1;
                    assert.equal(
                        actualFirstSentence, 
                        expectedFirstSentence, 
                        `ACTUAL 1st sentence: ${actualFirstSentence}. EXPECTED: ${expectedFirstSentence}. TEST CASE: ${testCase.text}`);
                }
            });
        });
    });
});