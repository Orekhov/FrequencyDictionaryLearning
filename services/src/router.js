const express = require('express');
const wordsMock = require('./mock-data/words');
const data = require('./data');
const ngramGenerator = require('./services/ngram-generator');

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

router.get('/ngrams/:lang/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    try {
        const ngramDetail = await data.dataAccess.getNgramDetail({
            userId: req.authenticatedUser.email,
            nGramType: type,
            id: id
        });
        res.status(200)
            .json(ngramDetail)
            .end();
    } catch (error) {
        console.warn(error);
        res.status(400).end();
    }
});

router.put('/ngrams/:lang/:type/:id/known', async (req, res) => {
    const { type, id } = req.params;
    const body = req.body;
    try {
        await data.dataAccess.setNgramKnownState({
            userId: req.authenticatedUser.email,
            nGramType: type,
            id: id,
            known: body.known
        });
        res.status(204)
            .end();
    } catch (error) {
        console.warn(error);
        res.status(400).end();
    }
});

router.post('/add-ngrams/raw/:lang/', async (req, res) => {
    const { rawText, sourceName } = req.body;
    const { lang, type } = req.params;
    const allNgrams = ngramGenerator.generateAllNgrams(rawText);
    const uploadId = await data.dataAccess.startUploadingNgrams({
        allNgrams,
        sourceName,
        type,
        lang,
        userId: req.authenticatedUser.email
    });
    res.status(200).send({ uploadId }).end();
});

router.get('/testadd', (req, res) => {
    data.dataAccess.insertUnigram({ ngram: "test", known: true, count: 42424, updated: new Date(Date.now()) });
    res.status(200).send('Added!').end();
});

module.exports = router;