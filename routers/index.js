/**
 * This file defines the routes used in your application
 * It requires the database module that we wrote previously.
 * http://expressjs.com/en/api.html#router
 */
var express = require('express');
var path = require('path');
var Reserved = require(path.join(process.cwd(), 'config', 'reserved'));

var router = express.Router();
module.exports = function (app) {
  
    /**
     * Rozsirenie modulu a uprava routerov
     * req : http://expressjs.com/en/api.html#req
     * res : http://expressjs.com/en/api.html#res
     */


    // invoked for any requests passed to this router cistenie a upravovanie dat za jazdy
    // nacitanie konfiguracných dát
    router.use(function (req, res, next) {
        res.locals.data = require(path.join(process.cwd(), 'config', 'app-data'))();
        // data.url_referer = '';
        next();
    });

   
    // load async reservation  and prepare variable  , '/okolie'
    router.use(['/rezervacia', '/okolie'], function (req, res, next) {
        var path = req.baseUrl.substring(1);
        res.locals.data.accommodation = (path == 'rezervacia') ? 0 : 1 ;
        res.locals.data.url_referer = 'reservation';
        setTimeout(function () {
            var rl = new Reserved(path);
            rl.getReservedDays(function (err, dates) {
                rl.rangeReservetDates(dates, res.locals.data.lang, function (err, ret) {
                    res.locals.data.content.accommodations[res.locals.data.accommodation].reserveddate = ret;
                    next();
                });
            });
        }, 1000);
    });
    
    // Basic routing
    router.get('/', function (req, res) {
        res.render('index.ejs', res.locals.data);
    });

    router.get('/index', function (req, res) {
        res.redirect('/');
    });

    router.get('/kontakt', function (req, res) {
        res.locals.data.url_referer = 'contacts';
        res.render('contacts.ejs', res.locals.data);
    });

    router.get('/rezervacia', function (req, res) {
        res.render('reservation.ejs', res.locals.data);
    });

    router.get('/okolie', function (req, res) {
        res.render('reservation.ejs', res.locals.data);
    });
    
    router.get('/dokumenty', function (req, res) {
        res.render('documents.ejs', res.locals.data);
        // res.redirect('/');
    });
    
    router.get('/galeria', function (req, res) {
        res.render('gallery.ejs', res.locals.data);
    });

   
    app.use('/', router);

};
