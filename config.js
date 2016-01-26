/**
 * This file runs some configuration settings on your express application.
 * http://expressjs.com/en/api.html#express
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

//var morgan = require('morgan')

var env = process.env;

// Require()-ing this module will return a function
// that the server.js file will use to configure the
// express application

module.exports = function (app) {
    
    
    // create a write stream (in append mode)
    //    var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

    // setup the logger
    //    app.use(morgan('combined', {stream: accessLogStream}))

    // set the view engine to ejs
    // https://github.com/mde/ejs.git
    app.set('view engine', 'ejs');
    
    // set the ejs engine to ejs-mate for using layouts
    app.engine('ejs', require('ejs-mate'));
    // Tell express where it can find the templates
    // http://expressjs.com/en/api.html#app.set
    // app.set('views', path.join(__dirname, 'app', 'pages'));
    app.set('views', path.join(__dirname, 'views'));
    
    // Make the files in the public folder available to the world
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'bower_components')));
    
    // Parse POST request data. 
    // It will be available in the req.body object 
    app.use(bodyParser.urlencoded({ extended: false }));
    
    /**
     * Tell express URL encodet and we using validation
     * https://www.npmjs.com/package/express-validator 
     * Dependencies: https://www.npmjs.com/package/validator
     */
    app.use(validator());
    
   
};
