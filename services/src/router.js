const express = require('express');
const wordsMock = require('./mock-data/words');
const data = require('./data');

var router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).send('Services are bootstrapped!').end();
});

router.get('/ngrams/:lang/:type', async (req, res) => {
    const { limit, known } = req.query;
    const { lang, type } = req.params;
    limitN = parseInt(limit);
    if (!Number.isInteger(limitN)) {
        limitN = 10;
    }
    var knownB = (known === 'true');
    try {
        const ngrams = await data.dataAccess.getNgrams({
            userId: req.authenticatedUser.email,
            language: lang,
            nGramType: type,
            limit: limitN,
            known: knownB
        });
        res.status(200)
            .json(ngrams)
            .end();
    } catch (error) {
        console.warn(error);
        res.status(400).end();
    }
});

router.post('/add-ngrams/raw/:lang/', async (req, res) => {
    const rawText = req.body.rawText;
    res.status(201).send({ok:"ok"}).end();
});

router.get('/testadd', (req, res) => {
    data.dataAccess.insertUnigram({ ngram: "test", known: true, count: 42424, updated: new Date(Date.now()) });
    res.status(200).send('Added!').end();
});

module.exports = router;