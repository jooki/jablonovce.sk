/**
 * This file runs some configuration settings on your express application.
 */

var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var env = process.env;

// Require()-ing this module will return a function
// that the server.js file will use to configure the
// express application

module.exports = function (app) {
    
    // set the view engine to ejs
    // https://github.com/mde/ejs.git
    app.set('view engine', 'ejs');
  
    // Tell express where it can find the templates
    app.set('views', path.join(__dirname, 'app', 'pages'));
    
    // Make the files in the public folder available to the world
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Tell express URL encodet and we using validation
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(validator());
};

