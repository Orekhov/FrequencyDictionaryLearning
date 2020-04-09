const generateAllNgramsTestCases = [{
    text: `
Author

The title

This is the first sentence. This is the second. Is it, though?
`,
    expectedUnigrams: new Map([
        ['the', 3],
        ['is', 3],
        ['this', 2],
        ['author', 1],
        ['title', 1],
        ['first', 1],
        ['sentence', 1],
        ['second', 1],
        ['it', 1],
        ['though', 1]
    ]),
    expectedBigrams: new Map([
        ['this is', 2],
        ['is the', 2],
        ['the title', 1],
        ['the first', 1],
        ['first sentence', 1],
        ['the second', 1],
        ['is it', 1],
        ['it, though', 1]
    ]),
    expectedTrigrams: new Map([
        ['this is the', 2],
        ['is the first', 1],
        ['the first sentence', 1],
        ['is the second', 1],
        ['is it, though', 1]
    ])
}];

module.exports = {
    generateAllNgramsTestCases: generateAllNgramsTestCases
}