var path = require('path');
var fs = require('fs');
const DB_PATH_SETTINGD = path.join(process.cwd(), 'data', 'config.json');
const DB_PATH_CONTENT = path.join(process.cwd(), 'data', 'data.json');
const DB_PATH_FILES = path.join(process.cwd(), 'data', 'files.json');
    
module.exports = function cfg() {

    var configdata = JSON.parse(require('fs').readFileSync(DB_PATH_SETTINGD, 'utf8'));

    var json = JSON.parse(require('fs').readFileSync(DB_PATH_CONTENT, 'utf8'));
    configdata.content = json.content;
    
    json = JSON.parse(require('fs').readFileSync(DB_PATH_FILES, 'utf8'));
    configdata.files = json;
    return configdata;
};