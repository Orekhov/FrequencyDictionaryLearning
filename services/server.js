const express = require('express');
const path = require('path');
const server = express();

server.get('/api/test', (req, res) => {
    res.status(200).send('Services are bootstrapped!').end();
});

server.use('/', express.static(path.join(__dirname,'fdl-web')));

server.get('*', function (req, res, next) {
    res.sendFile(path.resolve('fdl-web/index.html'));
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

module.exports = server;