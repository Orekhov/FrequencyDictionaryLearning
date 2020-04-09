const generateAllNgramsTestCases = [{
    text: `
Author

The title

This is the first sentence. This is the second. Is it, though? This is sentence.
`,
    expectedUnigrams: new Map([
        ['is', 4],
        ['the', 3],
        ['this', 3],
        ['sentence', 2],
        ['author', 1],
        ['title', 1],
        ['first', 1],
        ['second', 1],
        ['it', 1],
        ['though', 1]
    ]),
    expectedUnigramsCount: 10,
    expectedBigrams: new Map([
        ['this is', 3],
    ]),
    expectedBigramsCount: 1,
    expectedTrigrams: new Map([
        ['this is the', 2]
    ]),
    expectedTrigramsCount: 1,
    expectedTotalCount: 12
}];

module.exports = {
    generateAllNgramsTestCases: generateAllNgramsTestCases
}