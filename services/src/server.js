const express = require('express');
const path = require('path');
const router = require('./router');

function startServer() {
    const server = express();
    server.use(router);

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