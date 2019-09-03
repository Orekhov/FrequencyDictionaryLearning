const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Services are bootstrapped!').end();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

module.exports = app;