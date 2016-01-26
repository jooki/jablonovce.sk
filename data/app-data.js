var path = require('path');
var fs = require('fs');

module.exports = function cfg() {

    const DB_PATH_SETTINGD = path.join(__dirname, 'config.json')
    const DB_PATH_CONTENT = path.join(__dirname, 'data.json');

    var configdata = JSON.parse(require('fs').readFileSync(DB_PATH_SETTINGD, 'utf8'));

    var json = JSON.parse(require('fs').readFileSync(DB_PATH_CONTENT, 'utf8'));
    configdata.content = json.content;
    return configdata;
}