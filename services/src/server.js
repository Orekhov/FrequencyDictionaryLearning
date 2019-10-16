const express = require('express');
const path = require('path');
const router = require('./router');
const auth = require('./auth');

function startServer() {
    const apiBasePath = '/api';
    const server = express();
    server.use(apiBasePath, express.json({limit:'256kb'})); // TODO: make route specific
    server.use(apiBasePath, auth.authenticate);
    server.use(apiBasePath, router);

    const staticFilesPath = path.join(__dirname, '../fdl-web');
    const indexHtmlPath = path.join(staticFilesPath, 'index.html');

    server.use('/', express.static(staticFilesPath));
    server.get('*', (req, res, next) => res.sendFile(indexHtmlPath));

    const port = process.env.PORT || 8080;
    server.listen(port, () => console.log(`listening on port ${port}`));
}

module.exports = {
    startServer: startServer
};