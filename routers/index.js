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
      * povodne nastavenie JSON datat
      * zrejme to bude potrebne prepracovat aby sa to dalo editovat
      * a po zmene nanovo nacitat do pamate inak je potrebny restart servera 
     */
    var data = require(path.join(process.cwd(), 'config', 'app-data'))();
    var reservedDates = [];
    /**
     * Rozsirenie modulu a uprava routerov
     * req : http://expressjs.com/en/api.html#req
     * res : http://expressjs.com/en/api.html#res
     */


    // invoked for any requests passed to this router cistenie a upravovanie dat za jazdy
    router.use(function (req, res, next) {
        data.url_referer = '';
        next();
    });

   
    // load async reservation  and prepare variable  
    router.use(['/loft', '/groundfloor'], function (req, res, next) {
        var path = req.baseUrl.substring(1);
        var rl = new Reserved(path);
        data.accommodation = (path == 'loft') ? 0 : 1;
        data.url_referer = 'reservation';
        setTimeout(function () {
            rl.getReservedDays(function (err, dates) {
                rl.rangeReservetDates(dates, data.lang, function (err, ret) {
                    reservedDates = ret;
                    next();
                });
            });
        }, 1000);
    });
    
    // Basic routing
    router.get('/', function (req, res) {
        res.render('index.ejs', data);
    });

    router.get('/index', function (req, res) {
        res.redirect('/');
    });

    router.get('/contacts', function (req, res) {
        data.url_referer = 'contacts';
        res.render('contacts.ejs', data);
    });

    router.get('/loft', function (req, res) {
        data.content.accommodations[0].reserveddate = reservedDates;
        res.render('reservation.ejs', data);
    });

    router.get('/groundfloor', function (req, res) {
        data.content.accommodations[0].reserveddate = reservedDates;
        res.render('reservation.ejs', data);
    });

    router.get('/activities', function (req, res) {
        res.render('activities.ejs', data);
    });


    // This file has been called directly with 
    // `node index.js`. Start the server!
    // catch 404 and forward to error handler
    router.use(function (req, res, next) {
        // data.title = 'Error 404 Page not found.'
        res.status(404).render('404', data);
        var err = new Error('Page not found.');
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        router.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    router.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    app.use('/', router);

};
