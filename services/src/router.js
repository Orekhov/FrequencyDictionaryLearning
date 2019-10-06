const express = require('express');
const wordsMock = require('./mock-data/words');
const data = require('./data');

var router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).send('Services are bootstrapped!').end();
});

router.get('/words', (req, res) => {
    const { lang } = req.query;
    res.status(200)
        .json(wordsMock)
        .end();
});

router.get('/unigrams', async (req, res) => {
    const { limit } = req.query;
    limitN = parseInt(limit);
    if(!Number.isInteger(limitN)) {
        limitN = 10;
    }
    const unigrams = await data.dataAccess.getUnigrams(limitN);
    res.status(200)
        .json(unigrams)
        .end();
});

router.get('/testadd', (req, res) => {
    data.dataAccess.insertUnigram({ ngram: "test", known: true, count: 42424, updated: new Date(Date.now()) });
    res.status(200).send('Added!').end();
});

module.exports = router;