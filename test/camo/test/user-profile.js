"use strict";

// var connect = require('camo').connect;
var Document = require('camo').Document;
var bcrypt = require('bcrypt-nodejs');

// var uri = 'nedb://memory';
// var database;
// 
// connect(uri).then(function (db) {
//     database = db;
// });

class UserProfile extends Document {
    constructor() {
        super();

        this.schema({
            email: {
                type: String,
                unique: false
            },
            firstName: String,
            lastName: String,
            status: String,
            type: {
                type: String,
                choices: ['admin', 'user'],
                required: true
            },
            passwd: String,
            token: String,
            atTape: {
                type: String,
                default: 'local',
                choices: ['local', 'facebook', 'twitter', 'google'],
                required: true
            }
        });

    }

    // static collectionName() {
    //     return 'userprofiles';
    // }
    // hesovanie hesla aby nebolo citane 
    generateHash(password) {

        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
    // kontrola spravnosti hesla
    validPassword(password) {
        return bcrypt.compareSync(password, this.passwd);
    }


}

module.exports = UserProfile;



