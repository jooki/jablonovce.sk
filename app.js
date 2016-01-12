'use strict';
// BASE SETUP
// ==============================================
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var env = process.env;
var app = express();

const DB_PATH_SETTINGD = path.join(__dirname, 'data', 'config.json');
const DB_PATH_CONTENT = path.join(__dirname, 'data', 'data.json');

// povodne nacitanie JSON datat 
var data = require(DB_PATH_SETTINGD);
data.content = require(DB_PATH_CONTENT).content;

var userPost = require(path.join(__dirname, 'data', 'posted'))
// SETUP static paths
// ==============================================
app.use(express.static(path.join(__dirname, 'public')));
// ROUTES
// ==============================================
var router = express.Router();
    
router.get('/', function (req, res) {
    res.render(path.join(__dirname, 'app','pages','index.ejs'), data);
});

router.get('/index', function (req, res) {
    res.render(path.join(__dirname, 'app','pages','index.ejs'), data);
});

router.get('/contacts', function (req, res) {
    res.render(path.join(__dirname, 'app','pages','contacts.ejs'), data);
});

router.get('/loft', function (req, res) {
    data.accommodation = 0;
    res.render(path.join(__dirname, 'app','pages','reservation.ejs'), data);
});

router.get('/groundfloor', function (req, res) {
    data.accommodation = 1;
    res.render(path.join(__dirname, 'app','pages','reservation.ejs'), data);
});

router.get('/activities', function (req, res) {
    res.render(path.join(__dirname, 'app','pages','activities.ejs'), data);
});

// API
var bodyParser = require('body-parser');
var validator = require('express-validator');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

// kontrola pre kontakt
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
        },function (err, newDoc) {   // Callback is optional 
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

router.post('/api/reserve', function(req, res){
    req.checkBody("check_in", data.validationError.check_in_IsEmpty).notEmpty();
    req.checkBody("check_out",  data.validationError.check_out_IsEmpty).notEmpty();
    req.checkBody("adults",  data.validationError.adults_isNumeric).isNumeric();
    req.checkBody("children", data.validationError.children_isNumeric).isNumeric();
    req.checkBody("room_type", data.validationError.room_type_IsEmpty).notEmpty();
    if (req.body.room_type === "loft"){
        req.checkBody("adults", data.validationError.adults_loft_IsInt).isInt({min:2, max:12});
        req.checkBody("children", data.validationError.children_loft_IsInt).isInt({min:0, max:10});
    } 
    if (req.body.room_type === "groundfloor"){
        req.checkBody("adults", data.validationError.adults_groundfloor_IsInt).isInt({min:2, max:4});
        req.checkBody("children", data.validationError.children_groundfloor_IsInt).isInt({min:0, max:2});
    }
    req.checkBody("name_booking", data.validationError.name_IsEmpty).notEmpty();
    req.checkBody("email_booking", data.validationError.email_IsEmail).isEmail();
    req.checkBody("phone_booking", data.validationError.phone_format).optional().isNumeric();
    var html
    var errors = req.validationErrors();
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
        },function (err, newDoc) {   // Callback is optional 
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
// TODO: 
// ==============================================
app.get('/index_3', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/index_3.html'));
});

app.get('/rooms', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/rooms_list.html'));
});

app.get('/room', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/room_details.html'));
});

app.get('/booking', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/room_booking.html'));
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/about.html'));
});

app.get('/contact', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/contacts.html'));
});

app.get('/icon_pack_1', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/icon_pack_1.html'));
});

app.get('/icon_pack_2', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/icon_pack_2.html'));
});

app.get('/icon_pack_3', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/pages/icon_pack_3.html'));
});

app.use('/', router);
module.exports = app;