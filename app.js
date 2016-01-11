// BASE SETUP
// ==============================================
var express = require('express');
var path = require('path');
var ejs = require('ejs');
//var fs = require('fs');
var env = process.env;
var app = express();

var DB_PATH_CONTACTS = path.join(__dirname + '/DB/', 'contacts.json');
var DB_VERSION = 1;
var Database = require('warehouse');
var db = new Database({ path: DB_PATH_CONTACTS, version: DB_VERSION });

var ContactAs = db.model('contact', {
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    name: String,
    lastname: String,
    email: String,
    phone: String,
    msg: String
});

var data = require(__dirname + '/DB/links.json');
data.content = require(__dirname + '/DB/data.json').content;

//console.log(JSON.stringify(fulldata));
 
// SETUP static paths
// ==============================================
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// ROUTES
// ==============================================
var router = express.Router();

router.get('/', function (req, res) {
    res.render(path.join(__dirname + '/app/pages/index.ejs'), data);
});

router.get('/index', function (req, res) {
    res.render(path.join(__dirname + '/app/pages/index.ejs'), data);
});

router.get('/contacts', function (req, res) {
    res.render(path.join(__dirname + '/app/pages/contacts.ejs'), data);
});

router.get('/loft', function (req, res) {
    data.accommodation = 0;
    res.render(path.join(__dirname + '/app/pages/reservation.ejs'), data);
});

router.get('/groundfloor', function (req, res) {
    data.accommodation = 1;
    res.render(path.join(__dirname + '/app/pages/reservation.ejs'), data);
});

router.get('/activities', function (req, res) {
    res.render(path.join(__dirname + '/app/pages/activities.ejs'), data);
});

// API
var bodyParser = require('body-parser');
var validator = require('express-validator');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

// kontrola pre kontakt
router.post('/api/contact', function (req, res) {
    req.checkBody("name_contact", 'Prosím zapíšte vaše meno.').notEmpty();
    req.checkBody("lastname_contact", 'Prosím zapíšte vaše priezvisko.').notEmpty();
    req.checkBody("email_contact", 'Prosím napíšte správnu e-mailovú adresu').isEmail();
    req.checkBody("phone_contact", 'Prosím zapíšte vaše telefónne čísno na ktoré vas možeme kontaktovať.').isNumeric();
    req.checkBody("message_contact", 'Prosím zapíšte správu pre nás.').notEmpty();
    req.checkBody("verify_contact", 'Zapíšte vysledok z rovnice.').isNumeric('4');
    var html
    var errors = req.validationErrors();
    if (errors) {
        html = ejs.render('<% errors.forEach(function(error){ %><div class="error_message"><span><%= error.msg %></span></div> <% }) %>', { "errors": errors });
        res.send(html);
        return;
    } else {
        // normal processing here
        console.log(req.body);
        html = "<div id='success_page' style='padding:20px 0'>"
        html += "<strong >Email Sent.</strong>"
        html += "Thank you <strong>" + req.body.name_contact
        html += "</strong>,<br> your message has been submitted. We will contact you shortly."
        html += "</div>"
        res.send(html);

        ContactAs.save({
            name: req.body.name_contact,
            lastname: req.body.lastname_contact,
            email: req.body.email_contact,
            phone: req.body.phone_contact,
            msg: req.body.message_contact
        }).then(function (contact) {
            console.log(contact);
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

// SETTINGS
// ==============================================
if (env.NODE_ENV || 'development') {
    // setting end configuration for development 
    app.set('db uri', 'mongodb://localhost/jablonovce');
}

if (env.NODE_ENV || 'production') {
    // setting end configuration for produciotn 
    app.set('db uri', 'mongodb://localhost/jablonovce');
}

app.use('/', router);
module.exports = app;