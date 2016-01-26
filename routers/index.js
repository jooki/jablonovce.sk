/**
 * This file defines the routes used in your application
 * It requires the database module that we wrote previously.
 * http://expressjs.com/en/api.html#router
 */
var express = require('express');
var path = require('path');
var config = require('../config');
var router = express.Router();

module.exports = function (app) {
    /** 
     * povodne nastavenie JSON datat vytvorene rucne
     * zrejme to bude potrebne prepracovat aby sa to dalo editovat
     * a po zmene nanovo nacitat do pamate inak je potrebny restart servera 
    */

    var data = require(path.join(process.cwd(), 'data', 'app-data'))();


    /**
     * Rozsirenie modulu a uprava routerov
     * req : http://expressjs.com/en/api.html#req
     * res : http://expressjs.com/en/api.html#res
     */


    // invoked for any requests passed to this router
    router.use(function (req, res, next) {

        var usersLog = require(path.join(process.cwd(), 'data', 'loger'));
        usersLog.create({
            url: req.url,
            method: req.method,
            protocol: req.protocol,
            requestId: req.requestId,

            // In case there's a proxy server:
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        }, function () { });
        next();
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
        data.accommodation = 0;
        var rl = require(path.join(process.cwd(), 'data', 'reserved'));
        rl.getReservedDays(function (err, dates) {
            rl.rangeReservetDates(dates,data.default_lang ,function (err, reserveddate) {
                data.content.accommodations[data.accommodation].reserveddate = [reserveddate];
            });
        });
        data.url_referer = 'reservation';

        res.render('reservation.ejs', data);
    });

    router.get('/groundfloor', function (req, res) {
        data.accommodation = 1;
        data.url_referer = 'reservation';
        res.render('reservation.ejs', data);
    });

    router.get('/activities', function (req, res) {
        res.render('activities.ejs', data);
    });


    app.use('/', router);

};
