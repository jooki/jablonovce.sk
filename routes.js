/**
 * This file defines the routes used in your application
 * It requires the database module that we wrote previously.
 */
var express = require('express');
var ejs = require('ejs');
var path = require('path');

var router = express.Router();
// Setting database for posting all requirements
var userPost = require(path.join(__dirname, 'data', 'posted'))
// Setting Log for all posted users IP address 
var usersLog = require(path.join(__dirname, 'data', 'loger'))

/** 
 * povodne nastavenie JSON datat vytvorene rucne
 * zrejme to bude potrebne prepracovat aby sa to dalo editovat
 * a po zmene nanovo nacitat do pamate inak je potrebny restart servera 
*/
const DB_PATH_SETTINGD = path.join(__dirname, 'data', 'config.json');
const DB_PATH_CONTENT = path.join(__dirname, 'data', 'data.json');
var data = require(DB_PATH_SETTINGD);
data.content = require(DB_PATH_CONTENT).content;

/**
 * Rozsirenie modulu a uprava routerov
 */
module.exports = function Routes(app) {

    // Basic routing
    router.get('/', function (req, res) {
        res.render('index.ejs', data);
    });

    router.get('/index', function (req, res) {
        res.redirect('/');
    });

    router.get('/contacts', function (req, res) {
        res.render('contacts.ejs', data);
    });

    router.get('/loft', function (req, res) {
        data.accommodation = 0;
        res.render('reservation.ejs', data);
    });

    router.get('/groundfloor', function (req, res) {
        data.accommodation = 1;
        res.render('reservation.ejs', data);
    });

    router.get('/activities', function (req, res) {
        res.render('activities.ejs', data);
    });

    // This is executed before the next post requests
    router.post('*', function (req, res, next) {

        // Register the user in the database by ip address

        usersLog.create({
            ip: req.ip
        }, function () {
            // Continue with the other routes
            next();
        });

    });
    
    // TODO: bolo by fajn keby to bolo zjednodusene a rozdelene popripade zovseobecnene
    router.post('/api/contact', function (req, res) {
        req.checkBody("name_contact", data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("lastname_contact", data.validationError.lastname_IsEmpty).notEmpty();
        req.checkBody("email_contact", data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone_contact", data.validationError.phone_IsNumeric).isNumeric();
        req.checkBody("message_contact", data.validationError.message_IsEmpty).notEmpty();
        req.checkBody("verify_contact", data.validationError.verify_IsNumber).isNumeric('4');
        var html
        var errors = req.validationErrors();
        if (errors) {
            html = ejs.render('<% errors.forEach(function(error){ %><div class="error_message"><span><%= error.msg %></span></div> <% }) %>', { "errors": errors });
            res.send(html);
            return;
        } else {
            userPost.create({
                type: 'content',
                name: req.body.name_contact,
                lastname: req.body.lastname_contact,
                email: req.body.email_contact,
                phone: req.body.phone_contact,
                message: req.body.message_contact
            }, function (err, newDoc) {   // Callback is optional 
                // newDoc is the newly inserted document, including its _id 
                // newDoc has no key called notToBeSaved since its value was undefined 
                if (!err) {
                    html = "<div id='success_page' style='padding:20px 0'>"
                    + data.validationStatus.thankyou + "<strong>" + req.body.name_contact
                    + "</strong>,<br>" + data.validationStatus.contact + "</div>"
                    res.send(html);
                }
                console.log(newDoc);
            })
        }
    })

    router.post('/api/reserve', function (req, res) {
        // server site validacia
        req.checkBody("check_in", data.validationError.check_in_IsEmpty).notEmpty();
        req.checkBody("check_out", data.validationError.check_out_IsEmpty).notEmpty();
        req.checkBody("adults", data.validationError.adults_isNumeric).isNumeric();
        req.checkBody("children", data.validationError.children_isNumeric).isNumeric();
        req.checkBody("room_type", data.validationError.room_type_IsEmpty).notEmpty();
        if (req.body.room_type === "loft") {
            req.checkBody("adults", data.validationError.adults_loft_IsInt).isInt({ min: 2, max: 12 });
            req.checkBody("children", data.validationError.children_loft_IsInt).isInt({ min: 0, max: 10 });
        }
        if (req.body.room_type === "groundfloor") {
            req.checkBody("adults", data.validationError.adults_groundfloor_IsInt).isInt({ min: 2, max: 4 });
            req.checkBody("children", data.validationError.children_groundfloor_IsInt).isInt({ min: 0, max: 2 });
        }
        req.checkBody("name_booking", data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("email_booking", data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone_booking", data.validationError.phone_format).optional().isNumeric();
        
        var html
        var errors = req.validationErrors();
        // spracovanie validacie a zalogovanie do databazy
        if (errors) {
            html = ejs.render('<% errors.forEach(function(error){ %><div class="error_message"><span><%= error.msg %></span></div> <% }) %>', { "errors": errors });
            res.send(html);
            return;
        } else {
            userPost.create({
                type: 'reservation',
                check_in: req.body.check_in,
                check_out: req.body.check_out,
                adults: req.body.adults,
                children: req.body.children,
                room_type: req.body.room_type,
                name_booking: req.body.name_booking,
                email_booking: req.body.email_booking,
                phone_booking: req.body.phone_booking
            }, function (err, newDoc) {   // Callback is optional 
                // newDoc is the newly inserted document, including its _id 
                // newDoc has no key called notToBeSaved since its value was undefined 
                if (!err) {
                    html = "<div id='success_page' style='padding:20px 0'>"
                    + data.validationStatus.thankyou + "<strong>" + req.body.name_booking
                    + "</strong>,<br>" + data.validationStatus.contact + "</div>"
                    res.send(html);
                }
                console.log(newDoc);
            })
        }
    })

    app.use('/', router);
}

