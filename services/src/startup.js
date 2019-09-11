const commander = require('commander');
const config = require('./config');
const data = require('./data');
const server = require('./server');

function start() {
    const program = new commander.Command();
    program.option('-d, --data-source <type>', 'Underlying data source to be used', config.mongoDataSource);
    program.parse(process.argv);
    config.init({
        dataSource: program.dataSource
    });
    data.dataAccess.init();
    server.startServer();
}

module.exports = start;