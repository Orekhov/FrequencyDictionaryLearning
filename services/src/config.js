const mongoDataSource = "mongo";

class Configuration {
    constructor(config) {
        if(!config.dataSource) {
            throw "Data source is not defined";
        }
        this.dataSource = config.dataSource;
    }
}

let serverConfiguration;

function initServerConfiguration(config) {
    serverConfiguration = new Configuration(config);
}

function getServerConfigurationInstance() {
    if (!serverConfiguration) {
        throw "Server configuration is not initialized";
    }
    return serverConfiguration;
}

module.exports = {
    init: initServerConfiguration,
    get serverConfiguration() {
        return getServerConfigurationInstance();
    },
    mongoDataSource: mongoDataSource
};