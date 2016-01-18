'use strict';

var path = require('path');
const DB_PATH_USER_CONTENT = path.join(__dirname, 'posted.db');

var Database = require('nedb');
var db = new Database({ filename: DB_PATH_USER_CONTENT, autoload: true, timestampData: true });
// If there was an error, err is not null 
db.ensureIndex({ fieldName: 'type' }, function (err) { });

var postdata = {
    
    // metoda na vlozenie do DB
    create: function (data, cb) {
        db.insert(data, cb);
    },
    // metoda na vylistovanie vsetkeho z DB 
    list: function (cb) {
        db.find({}).exec(cb);
    },
    
    // metoda na vylistovanie dokumentov typu contact z DB 
    listAllContact: function (cb) {
        db.find({ type: 'contact' }).exec(cb);
    },
    
    // metoda na vylistovanie dokumentov typu booking z DB 
    listAllBooking: function (cb) {
        db.find({ type: 'booking' }).exec(cb);
    },
    
    // odstranenie zaznamu
    remove: function (id, cb) {
        db.remove({ _id: id }, cb);
    },
    
    count: function (){
        db.count({type: 'contact'}, function (err, count){
            contact: count;
        });
        db.count({type: 'booking'}, function (err, count){
            booking: count;
        })
    }
};

module.exports = postdata;
