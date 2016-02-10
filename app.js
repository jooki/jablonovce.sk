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
var debug = require('debug')('node-jablonovce:server');
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
    res.status(404).render('404', data);
    var err = new Error('Page not found.');
    err.status = 400
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);
app.on('error', onError);
app.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = app.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


console.log('Your application is running on http://localhost' + port);