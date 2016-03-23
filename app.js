/**
 * This is the main file of the application. Run it with the
 * `node index.js` command from your terminal
 *
 * Remember to run `npm install` in the project folder, so 
 * all the required libraries are downloaded and installed.
 */

var express = require('express');
var commpress = require('compression');
var path = require('path');
var port = process.env.PORT || 8080;


// Create a new express.js web app:
var app = express();
app.use(commpress());
// Configure express with the settings found in
// our config.js file

require(path.join(__dirname, 'config', 'config'))(app);

// Add the routes that the app will react to,
// as defined in our routes.js file

require(path.join(__dirname, 'routers', 'index'))(app);
require(path.join(__dirname, 'routers', 'api'))(app);
require(path.join(__dirname, 'routers', 'admin'))(app);

// var adminExpress = express();
// app.use('/admin', require('./lib/sbadmin/app')(adminExpress));

// This file has been called directly with 
// `node index.js`. Start the server!

// This file has been called directly with 
// `node index.js`. Start the server!
// catch 404 and forward to error handler

app.use(function (req, res, next) {
    // data.title = 'Error 404 Page not found.'
    res.status(404).render('404', res.locals.data); //TODO: Odskusat
    var err = new Error('Page not found.');
    err.status = 400
    res.end();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        try {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        } catch (error) {
            console.error(error.stack);
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', res.locals.data);
});


app.listen(port);
console.log('Your application is running on http://localhost:' + port);