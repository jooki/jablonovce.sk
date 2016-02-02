// http://passportjs.org/docs

var path = require('path');
var LocalStrategy = require('passport-local').Strategy;
var UserProfile = require('./user-profile');


module.exports = function (passport) {
 
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            // asynchronous
            // UserProfile.findOne wont fire unless data is sent back
            process.nextTick(function () {
                UserProfile.loadOne({ 'email': email }).then(function (user) {
              
                    // check to see if theres already a user with that email
                    if (user) {
                        console.log(user.firstName);
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = UserProfile.create();
                        newUser.email = email;
                        newUser.password = password;
                        newUser.save().then(function () {
                            console.log('Both Wallet and Money objects were saved!');
                            return done(null, newUser);
                        });
                    }
                });

            });
        }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email load from page form-control
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            UserProfile.loadOne({ 'email': email }).then(function (user) {

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                return done(null, user);

            });
        }));
};