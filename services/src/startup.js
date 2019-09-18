const commander = require('commander');
const config = require('./config');
const data = require('./data');
const server = require('./server');

async function start() {
    try {
        const program = new commander.Command();
        program.option('-d, --data-source <type>', 'Underlying data source to be used', config.mongoDataSource);
        program.parse(process.argv);
        config.init({
            dataSource: program.dataSource
        });
        await data.dataAccess.init();
        server.startServer();
    } catch (error) {
        console.error('Error on server startup.');
        console.error(error);
    }
}

module.exports = start;