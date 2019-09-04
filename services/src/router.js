const express = require('express');
const wordsMock = require('./mock-data/words');

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

module.exports = router;