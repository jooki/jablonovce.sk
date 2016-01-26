
var express = require('express');
var path = require('path');


var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', require('ejs-mate'));

require('../config')(app);
require('../routers/index')(app);
// require('../routers/api')(app);


// Tell express where it can find the templates
// !! prepisanie existujuceho nastavenia lebo pre testovanie je layout inde  
app.set('views', path.join(process.cwd(), 'views'));
// app.set('views',__dirname + '/fixtures');

/**
 * 

app.get('/',function(req,res,next){
  res.render('index',{"what":"EJS - mate"})
})
 */
const DB_PATH_SETTINGD = path.join(process.cwd(), 'data', 'config.json');
const DB_PATH_CONTENT = path.join(process.cwd(), 'data', 'data.json');
var data = require(DB_PATH_SETTINGD);
data.content = require(DB_PATH_CONTENT).content;

// Routing pages
// app.get('/loft', function (req, res) {
//     data.accommodation = 0;
//     data.url_referer = 'reservation';
//     res.render('reservation', data);
// });
// 
// app.get('/groundfloor', function (req, res) {
//     data.url_referer = 'reservation';
//     res.render('reservation', data);
// });

app.get('/contacts', function (req, res, next) {
    data.accommodation = 'undefined';
    data.url_referer = 'contact';
    res.render('contacts', data, function (err, html) {
        if (!err) {
            res.send(html);
        } else {
            console.log(err);
            next();
        }
    });
});

app.get('/activities', function (req, res) {
    res.render('activities.ejs', data);
});

app.get('/', function (req, res) {
    res.render('index.ejs', data);
});

app.get('/index', function (req, res) {
    res.redirect('/');
});

// rendering sub functions
app.get('/about', function (req, res, next) {
    res.render('partials/about', data);
});

app.get('/activity', function (req, res, next) {
    res.render('partials/activity', data);
});

app.get('/common_scripts', function (req, res, next) {
    res.render('partials/common_scripts', data);
});

app.get('/footer', function (req, res, next) {
    res.render('partials/footer', data);
});

app.get('/info', function (req, res, next) {
    res.render('partials/info', data);
});

app.get('/langs', function (req, res, next) {
    res.render('partials/langs', data);
});

app.get('/menu', function (req, res, next) {
    res.render('partials/menu', data);
});

app.get('/preloader', function (req, res, next) {
    res.render('partials/preloader', data);
});

app.get('/accomodation', function (req, res, next) {
    res.render('partials/acomodation', data);
});

app.get('/google-analyt', function (req, res, next) {
    res.render('partials/google-analytics.ejs', data);
});

app.get('/facebook', function (req, res, next) {
    res.render('partials/facebook.ejs', data);
});

app.get('/rs-plugin_scripts', function (req, res, next) {
    res.render('partials/rs-plugin_scripts', data);
});

app.get('/slider', function (req, res, next) {
    res.render('partials/slider', data);
});

app.get('/general_facilities', function (req, res, next) {
    res.render('partials/general_facilities', data);
});

app.get('/list_apartman', function (req, res, next) {
    res.render('partials/list_apartman', data);
});

app.get('/booking_box', function (req, res, next) {
    res.render('partials/reservation//booking_box', data);
});

app.get('/contact_box', function (req, res, next) {
    res.render('partials/reservation//contact_box', data);
});

app.get('/reviews', function (req, res, next) {
    res.render('partials/reservation/reviews', data);
});

app.get('/slider_pro', function (req, res, next) {
    res.render('partials/reservation/slider_pro', data);
});

app.get('/scripts-reservation', function (req, res, next) {
            data.accommodation = 0;
        var rl = require(path.join(process.cwd(), 'data', 'reserved'));
        rl.listDate(function (err, reserveddate){ 
             data.content.accommodations[ data.accommodation].reserveddate = [reserveddate];
            });
    res.render('partials/reservation/scripts', data);
});

app.get('/scripts-contact', function (req, res, next) {
    res.render('partials/contact/scripts', data);
});

app.get('/server', function (req, res, next) {
    res.render(__dirname + '../test/server/server');
});
app.get('/serversend', function (req, res, next) {
    res.status(200).send('<p>test ok</p>');
});

app.listen(3000);

