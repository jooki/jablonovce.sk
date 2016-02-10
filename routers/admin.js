var expres = require('express');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var path = require('path');

module.exports = function (app) {
    // http://passportjs.org/docs
    // pass passport for configuration
    require(path.join(process.cwd(), 'config', 'passport'))(passport);
    //setting for authentification
    
    // nastavenie session https://github.com/expressjs/session 
    // konfiguracia cookies
    var sess = {
        secret: '86321286-CD82-4AA8-B45D-1A9AB9E0464C',
        resave: true,
        saveUninitialized: false,
        cookie: {}
        }
     
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
        sess.cookie.maxAge = 60000;
    };
    
    app.use(session(sess)); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
  
    // require('./routes/index')(app, passport);  
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

 
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    // http://passportjs.org/docs/basic-digest
    app.get('/setup', isLoggedIn, function (req, res) {
        // app.use('/admin', admin);
        
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/setup', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

};

// route middleware to make sure a user is logged in 
// kontroluje ci je pouzivatel autentifikovany  pouzite v /setup redirekcii
function isLoggedIn(req, res, next) {
 
    // http://passportjs.org/docs/authenticate
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}