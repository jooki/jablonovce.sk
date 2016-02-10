/**
 * This file defines the routes used in your application
 * It requires the res.locals.database module that we wrote previously.
 * http://expressjs.com/en/api.html#router
 */
var express = require('express');
var path = require('path').join;
var ejs = require('ejs');
var read = require('fs').readFileSync;

// var mailer = require(path.join(process.cwd(), 'config', 'mailer'));
var nodemailer = require('nodemailer');

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function sendMailer(req, res, next) {
    var urlPath = req.url.substring(1);
    var mailOptions = res.locals.data.mailer;
    var str = '';
    try {
        var transporter = nodemailer.createTransport(mailOptions.SMTP);
        
        if (urlPath == 'contact') {
            mailOptions.subject = 'Požiadavka z web stránka o kontaktovanie';
            str = read(path(process.cwd(), 'views', 'emails', 'contact.ejs'), 'utf8');
             
        } else {
            mailOptions.subject = 'Požiadavka z web stránka na rezerváciu';
            str = read(path(process.cwd(), 'views', 'emails', 'reservation.ejs'), 'utf8');
        }
        mailOptions.to = req.body.email;
        mailOptions.html  = ejs.render(str, {'body':req.body});;
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('/api/sendMailer/error');
                console.log(err);
                console.log(info);
            } else {
                // if you don't want to use this transport object anymore, uncomment following line
                socketTimeout: 30 * 1000 // 0.5 min: Time of inactivity until the connection is closed
                transporter.close(); // shut down the connection pool, no more messages
            }
        })
    } catch (error) {
        console.log('/api/sendMailer/error');
        console.log(error);
    }
    transporter.close();
    next();
}


// Setting res.locals.database for posting all requirements
var userPost = require(path(process.cwd(), 'config', 'posted'));
var Reserved = require(path(process.cwd(), 'config', 'reserved'));

const ERR_VALIDATION = '<% errors.forEach(function(error){ %><div class="error_message"><span><%= error.msg %></span></div> <% }) %>';

var router = express.Router();
module.exports = function (app) {
    
    /**
     * Validation body contact
     * https://www.npmjs.com/package/express-validator 
     * Dependencies: https://www.npmjs.com/package/validator
     */
    router.post('/contact', function (req, res, next) {
        req.checkBody("name", res.locals.data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("lastname_contact", res.locals.data.validationError.lastname_IsEmpty).notEmpty();
        req.checkBody("email", res.locals.data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone", res.locals.data.validationError.phone_IsNumeric).isNumeric();
        req.checkBody("message_contact", res.locals.data.validationError.message_IsEmpty).notEmpty();
        req.checkBody("verify_contact", res.locals.data.validationError.verify_IsNumber).isNumeric('4');

        if (req.validationErrors()) {
            var html = ejs.render(ERR_VALIDATION, { "errors": req.validationErrors() });
            res.send(html);
            return;
        } else {
            next();
        }
    });

    router.post('/contact', sendMailer) 
    
    /**
     * Zapisanie do res.locals.databazy 
     * req.path vrati /api/contact to pomoze pri prelozdelenie 
     */
    router.post('/contact', function (req, res, next) {

        userPost.create({
            type: 'contact',
            name: req.body.name,
            lastname: req.body.lastname_contact,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message_contact
        }, function (err, newDoc) {   // Callback is optional 
            // newDoc is the newly inserted document, including its _id 
            // newDoc has no key called notToBeSaved since its value was undefined 
            if (!err) {
                var html = "<div id='success_page' style='padding:20px 0'>"
                    + res.locals.data.validationStatus.thankyou + "<strong>" + req.body.name
                    + "</strong>,<br>" + res.locals.data.validationStatus.contact + "</div>";
                this.docToSend = newDoc;
                res.send(html);

            } else {
                next(err);
            }
        });
    });

    // Validation body booking
    router.post('/reserve', function (req, res, next) {
        req.checkBody("check_in", res.locals.data.validationError.check_in_IsEmpty).notEmpty();
        req.checkBody("check_out", res.locals.data.validationError.check_out_IsEmpty).notEmpty();
        req.checkBody("adults", res.locals.data.validationError.adults_isNumeric).isNumeric();
        req.checkBody("children", res.locals.data.validationError.children_isNumeric).isNumeric();
        req.checkBody("room_type", res.locals.data.validationError.room_type_IsEmpty).notEmpty();
        if (req.body.room_type == "loft") {
            req.checkBody("adults", res.locals.data.validationError.adults_loft_IsInt).isInt({ min: 2, max: 12 });
            req.checkBody("children", res.locals.data.validationError.children_loft_IsInt).isInt({ min: 0, max: 10 });
        }
        if (req.body.room_type == "groundfloor") {
            req.checkBody("adults", res.locals.data.validationError.adults_groundfloor_IsInt).isInt({ min: 2, max: 4 });
            req.checkBody("children", res.locals.data.validationError.children_groundfloor_IsInt).isInt({ min: 0, max: 2 });
        }
        req.checkBody("name", res.locals.data.validationError.name_IsEmpty).notEmpty();
        req.checkBody("email", res.locals.data.validationError.email_IsEmail).isEmail();
        req.checkBody("phone", res.locals.data.validationError.phone_format).isNumeric();

        if (req.validationErrors()) {
            var html = ejs.render(ERR_VALIDATION, { "errors": req.validationErrors() });
            res.send(html);
            return;
        } else {
            next();
        }
    });

    router.post('/reserve', sendMailer) 
    /**]
     * Zapisanie do res.locals.databazy 
     */
    router.post('/reserve', function (req, res) {

        userPost.create({
            type: 'booking',
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            adults: req.body.adults,
            children: req.body.children,
            room_type: req.body.room_type,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        }, function (err, newDoc) {
            if (!err) {
                var html = "<div id='success_page' style='padding:20px 0'>"
                    + res.locals.data.validationStatus.thankyou + "<strong>" + req.body.name
                    + "</strong>,<br>" + res.locals.data.validationStatus.contact + "</div>";
                res.send(html);
            } else {
                console.log(err);
            }
        });
    });

    app.use('/api', router);
};