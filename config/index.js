const nconf = require('nconf');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const configJsonInEnvs = process.env.configJson ? JSON.parse(process.env.configJson) : undefined;

const configPath = __dirname;
function loadConfig() {
    nconf.argv()
    .env()
    .defaults({
        ...configJsonInEnvs
    });
    nconf.file('acprimeserver', path.join(configPath, 'config.json'));

    return nconf;
}

module.exports = loadConfig();
module.exports.loadConfig = loadConfig;