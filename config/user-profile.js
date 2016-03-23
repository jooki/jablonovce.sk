"use strict";

// https://github.com/scottwrobinson/camo

var camo = require('camo')
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

var database;
var uri = 'nedb://' + path.join(process.cwd(), 'data', 'usersprofile')
// var uri = 'nedb://memory';

// Napojenie na databazy musi zbehnut aby bolo iciovany objekt v globalnej premennej
camo.connect(uri).then(function (db) {
    database = db;
});

// definovanie vlastnej triedy dokumentu pozor je potrebne overit vysledok po ulozeny lebo moze vzniknut chyba
class UserProfile extends camo.Document {
    constructor() {
        super();
        
        // https://github.com/scottwrobinson/camo#declaring-your-document
        this.schema({
            email: {
                type: String,
                unique: true
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
            provider: {
                type: String,
                default: 'local',
                choices: ['local', 'facebook', 'twitter', 'google'],
                required: true
            }
        });

    }

    static collectionName() {
        return 'userprofiles';
    }
    // hesovanie hesla aby nebolo citane 
    generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
    
    // kontrola spravnosti hesla
    validPassword(password) {
        return bcrypt.compareSync(password, this.passwd);
    }

    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    set password(password) {
        this.passwd = this.generateHash(password);
    }

}

module.exports = UserProfile;



