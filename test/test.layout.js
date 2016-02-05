
var express = require('express');
var path = require('path');
var request = require('supertest');
//var request = require('./support/http')
var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', require('ejs-mate'));

require('../config/config')(app);
// require('../routes')(app);

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
app.get('/loft', function (req, res) {
    data.accommodation = 0;
    data.url_referer = 'reservation';
    res.render('reservation', data);
});

app.get('/groundfloor', function (req, res) {
    data.url_referer = 'reservation';
    res.render('reservation', data);
});

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
    res.render('partials/reservation/scripts', data);
});

app.get('/scripts-contact', function (req, res, next) {
    res.render('partials/contact/scripts', data);
});

app.get('/server', function (req, res, next) {
    res.render(__dirname + '/server/server');
});
app.get('/serversend', function (req, res, next) {
    res.status(200).send('<p>test ok</p>');
});

function return42() {
    return 42;
}

describe('test layoutejs', function () {

    describe('test Should', function () {

        it('should work', function () {
            return42().should.be.equal(42);
        });
    });

    describe('SERVER', function () {
        it('kontrola funkcnosti testu serversend', function (done) {
            request(app)
                .get('/serversend')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.text.should.be.equal('<p>test ok</p>');
                });
        });
        it('kontrola funkcnosti testu render server', function (done) {
            request(app)
                .get('/server')
                .end(function (res) {
                    res.body.should.equal("<h1>Server</h>");
                    done();
                });
        });

        it('kontrola funkcnosti testu so serverom BODY', function (done) {
            request(app)
                .get('/server')
                .expect(200)
                .end(function (err, res) {
                    res.body.should.equal('<h>Server</h>');
                    done();
                });
        });
    });

    describe('layout tests', function () {
        it('should render with default layout.ejs', function (done) {
            request(app)
                .get('/index')
                .expect(200)
                .end(function (err, res) {
                    // console.log(res.title);
                    res.title.should.equal('titulek ABC');
                    res.content.should.equal('lorem ipsum set dolorem');
                    done();
                });
        });
        it('should render with default layout_.ejs whit submit ');
    });

    describe('GET pages', function () {
        it('should render index with default layout.ejs ');
        it('should render loft with default layout_.ejs whit submit ');
        it('should render groundfloor with default layout_.ejs whit submit ');
        it('should render contact with default layout_.ejs whit submit ');
        describe('render partials', function () {
            it('info');
        });
    });

    describe('API pages', function () {
        it('shuld post API contact');
        it('shuld post API booking');

    });

    describe('systems', function () {
        it('loger');
        it('logconsole');
        describe('Errors', function () {
            it('404');
            it('500');
        });
    }); 
    
    // app.listen(3000);

});