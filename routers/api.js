/**
 * This file defines the routes used in your application
 * It requires the database module that we wrote previously.
 * http://expressjs.com/en/api.html#router
 */
var express = require('express');
var path = require('path');
var ejs = require('ejs');
// var mailer = require(path.join(process.cwd(), 'config', 'mailer'));
var nodemailer = require('nodemailer');
var mailOptions = {
    from: 'Chalupa jablonovce <info@wica.sk>',
    to: 'jozef.kluvanec@simb.sk',
    subject: 'Testovaci email',
    body: 'Obycajny text',
    SMTP: {
        host: 'simb01.simb.sk',
        // port: 465,
        // secure: true,
        auth: {
            user: "info",
            pass: "1nf0wica"
        }
    }
};

// Setting database for posting all requirements
var userPost = require(path.join(process.cwd(), 'config', 'posted'));
var Reserved = require(path.join(process.cwd(), 'config', 'reserved'));

const ERR_VALIDATION = '<% errors.forEach(function(error){ %><div class="error_message"><span><%= error.msg %></span></div> <% }) %>';

var router = express.Router();
module.exports = function (app) {
    
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
    
    // rozsirene logovanie vsetkoho co pride na Api do consoly
    router.use('/api', function (req, res, next) {
        console.log('%s %s %s', req.method, req.url, req.path);
        next();
    });
    
    /**
     * Validation body contact
     * https://www.npmjs.com/package/express-validator 
     * Dependencies: https://www.npmjs.com/package/validator
     */
    router.post('/contact', function (req, res, next) {
        req.checkBody("name_contact", data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("lastname_contact", data.validationError.lastname_IsEmpty).notEmpty();
        req.checkBody("email_contact", data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone_contact", data.validationError.phone_IsNumeric).isNumeric();
        req.checkBody("message_contact", data.validationError.message_IsEmpty).notEmpty();
        req.checkBody("verify_contact", data.validationError.verify_IsNumber).isNumeric('4');

        if (req.validationErrors()) {
            var html = ejs.render(ERR_VALIDATION, { "errors": req.validationErrors() });
            res.send(html);
            return;
        } else {
            next();
        }
    });

    router.post('/contact', function (req, res, next) {
        var transporter = nodemailer.createTransport(mailOptions.SMTP);
        mailOptions.to = req.body.email_contact;
        mailOptions.subject = 'Poziadavka na kontakt';
        mailOptions.body = req.body.message_contact;
        try {
            transporter.sendMail(mailOptions,function (err,info) {
                console.log(err);
                console.log(info)        
            })
        } catch (error) {
            console.log(error)    
        }

        next();
    }) 
    
    /**
     * Zapisanie do databazy 
     * req.path vrati /api/contact to pomoze pri prelozdelenie 
     */
    router.post('/contact', function (req, res, next) {

        userPost.create({
            type: 'contact',
            name: req.body.name_contact,
            lastname: req.body.lastname_contact,
            email: req.body.email_contact,
            phone: req.body.phone_contact,
            message: req.body.message_contact
        }, function (err, newDoc) {   // Callback is optional 
            // newDoc is the newly inserted document, including its _id 
            // newDoc has no key called notToBeSaved since its value was undefined 
            if (!err) {
                var html = "<div id='success_page' style='padding:20px 0'>"
                    + data.validationStatus.thankyou + "<strong>" + req.body.name_contact
                    + "</strong>,<br>" + data.validationStatus.contact + "</div>";
                this.docToSend = newDoc;
                res.send(html);

            } else {
                next(err);
            }
        });
    });

   
    
    // Validation body booking
    router.post('/reserve', function (req, res, next) {
        req.checkBody("check_in", data.validationError.check_in_IsEmpty).notEmpty();
        req.checkBody("check_out", data.validationError.check_out_IsEmpty).notEmpty();
        req.checkBody("adults", data.validationError.adults_isNumeric).isNumeric();
        req.checkBody("children", data.validationError.children_isNumeric).isNumeric();
        req.checkBody("room_type", data.validationError.room_type_IsEmpty).notEmpty();
        if (req.body.room_type == "loft") {
            req.checkBody("adults", data.validationError.adults_loft_IsInt).isInt({ min: 2, max: 12 });
            req.checkBody("children", data.validationError.children_loft_IsInt).isInt({ min: 0, max: 10 });
        }
        if (req.body.room_type == "groundfloor") {
            req.checkBody("adults", data.validationError.adults_groundfloor_IsInt).isInt({ min: 2, max: 4 });
            req.checkBody("children", data.validationError.children_groundfloor_IsInt).isInt({ min: 0, max: 2 });
        }
        req.checkBody("name_booking", data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("email_booking", data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone_booking", data.validationError.phone_format).optional().isNumeric();

        if (req.validationErrors()) {
            var html = ejs.render(ERR_VALIDATION, { "errors": req.validationErrors() });
            res.send(html);
            return;
        } else {
            next();
        }
    });
    
    /**]
     * Zapisanie do databazy 
     */
    router.post('/reserve', function (req, res) {

        userPost.create({
            type: 'booking',
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            adults: req.body.adults,
            children: req.body.children,
            room_type: req.body.room_type,
            name_booking: req.body.name_booking,
            email_booking: req.body.email_booking,
            phone_booking: req.body.phone_booking
        }, function (err, newDoc) {
            if (!err) {
                var html = "<div id='success_page' style='padding:20px 0'>"
                    + data.validationStatus.thankyou + "<strong>" + req.body.name_booking
                    + "</strong>,<br>" + data.validationStatus.contact + "</div>";
                res.send(html);
            } else {
                console.log(err);
            }
        });
    });

    app.use('/api', router);
};