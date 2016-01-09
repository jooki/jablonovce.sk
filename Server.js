// BASE SETUP
// ==============================================
var app = require('./app');
var port    =   process.env.PORT || 8080;

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Running at Port ' + port)