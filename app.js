// BASE SETUP
// ==============================================
var express = require('express');
var path = require('path');
//var fs = require('fs');
var env = process.env;
var app = express();

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