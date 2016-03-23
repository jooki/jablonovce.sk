'use strict';

var camo = require('camo')
var path = require('path');

var database;
const uri = path.join(process.cwd(), 'data', 'files.db');

// Napojenie na databazy musi zbehnut aby bolo iciovany objekt v globalnej premennej
camo.connect(uri).then(function (db) {
    database = db;
});

class MyFiles extends camo.Document {
    constructor(){
        super();
        
        this.schema({
            type:String,
            fileName:String,
            isPublic: Boolean,
            description: String
        })
    }
    
    static collectionName() {
        return 'files';
    }
    
}

// load file form dir and return path 
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

module.exports = MeFiles;
