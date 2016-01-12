'use strict';

var path = require('path');
const DB_PATH_USER_CONTENT = path.join(__dirname, 'posted.db');

var Database = require('nedb');
var db = new Database({ filename: DB_PATH_USER_CONTENT , autoload: true, timestampData: true});

var postdata = {
    // metoda na vlozenie do DB
    create:function(data, cb){  
        db.insert(data , cb);
    },
    // metoda na vylistovanie vsetkeho z DB 
    list: function (cb){
        db.find({}).exec(cb);
    },
    // odstranenie zaznamu
    remove: function (id, cb){
        db.remove({ _id : id }, cb);
    }
};

module.exports = postdata;
