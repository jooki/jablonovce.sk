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


    // invoked for any requests passed to this router
    router.use(function (req, res, next) {
        data.url_referer = '';
// Zrudene vlastne logovanie aktualne sa pouziva loger na applikacii celkovy
        // var usersLog = require(path.join(process.cwd(), 'data', 'loger'));
//         usersLog.create({
//             url: req.url,
//             method: req.method,
//             protocol: req.protocol,
//             requestId: req.requestId,
// 
//             // In case there's a proxy server:
//             ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
//         }, function () { });
        next();
    });

   /** 
     * povodne nastavenie JSON datat
     * zrejme to bude potrebne prepracovat aby sa to dalo editovat
     * a po zmene nanovo nacitat do pamate inak je potrebny restart servera 
    */

    var data = require(path.join(process.cwd(), 'config', 'app-data'))();
    var reservedDates = [];
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


    app.use('/', router);

};
