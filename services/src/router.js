const express = require('express');
const wordsMock = require('./mock-data/words');
const data = require('./data');

var router = express.Router();

router.get('/api/test', (req, res) => {
    res.status(200).send('Services are bootstrapped!').end();
});

router.get('/api/words', (req, res) => {
    const {lang} = req.query;
    res.status(200)
    .json(wordsMock)
    .end();
});

router.get('/api/testadd', (req, res) => {
    data.dataAccess.insertUnigram({ ngram: "test", known: true, count: 42424, updated: new Date(Date.now()) });
    res.status(200).send('Added!').end();
});

module.exports = router;