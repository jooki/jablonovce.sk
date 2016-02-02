"use strict";

// http://chaijs.com/api/bdd/

var path = require('path');
var camo = require('camo');

var up = require(path.join(process.cwd(), 'data', 'user-profile'));

describe('Data test user-profile.js', function () {

//     var uri = "nedb://" + __dirname + '/usersProfile';
//     // var uri = 'nedb://memory';
//     var database = null;
// 
//     before(function (done) {
//         connect(uri).then(function (db) {
//             database = db;
//             return database.dropDatabase();
//             //    return done();
//         }).then(function () {
//             return done();
//         });
//     });
   
    // beforeEach(function (done) {
    //     done();
    // });

    //     afterEach(function (done) {
    //         database.dropDatabase().then(function () { }).then(done, done);
    // 
    //     });
    //     
    // after(function(done) {
    //      database.dropDatabase().then(function() {}).then(done, done);
    //     
    // });

    it('create user profile', function (done) {

        var user = up.create();
        user.email = 'jano@jano.sk';
        user.type = 'admin';
        user.provider = 'local';
        user.password = '123pass';


        user.save().then(function (up) {
            up.email.should.equal('jano@jano.sk');
            up.type.should.equal('admin');
            up.provider.should.equal('local');

        }).catch(function (err) {
            err.message.should.equal("Can't insert key jano@jano.sk, it violates the unique constraint");
        }).then(done, done);

    });

    it('create and catch duplicity user profile', function (done) {

        var user = up.create();
        user.email = 'jano@jano.sk';
        user.type = 'admin';
        user.provider = 'local';
        
        
        try {
            user.save();
        } catch (err) {
            err.message.hsoud.equal("Can't insert key jano@jano.sk, it violates the unique constraint");
        }
        done();
    });

    it('load one user profile', function (done) {
        up.loadOne({ email: 'jano@jano.sk' }).then(function (up) {
            up.email.should.equal('jano@jano.sk')
            done();
        })
    });

    it('test isValid Password', function (done) {
        up.loadOne({ email: 'jano@jano.sk' }).then(function (up) {
            up.validPassword('123pass').should.be.true
        }).then(done,done)
    });
    
    
    it('test db object', function (done) {
       var nieco = camo.getClient().driver();
       nieco.should.be.ok
       
        done();
    });
    
});