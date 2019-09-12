const config = require('./config');
const dataAccessMongo = require('./data-access/data-access-mongo');
const dataAccessFirestore = require('./data-access/data-access-firestore');

let dataAccessInstance;

function initDataAccessInstance() {
    const dataSource = config.serverConfiguration.dataSource;
    if (dataSource === config.mongoDataSource) {
        dataAccessInstance = dataAccessMongo;
    } else if(dataSource === config.firestoreDataSource) {
        dataAccessInstance = dataAccessFirestore;
    } else {
        throw `Unknown data source: ${dataSource}`;
    }
}

function getDataAccessInstance() {
    if(!dataAccessInstance) {
        initDataAccessInstance();
    }
    return dataAccessInstance;
}

module.exports = {
    get dataAccess() {
        return getDataAccessInstance();
    }
};
