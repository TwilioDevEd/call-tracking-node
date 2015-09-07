var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');
var twimlApp = require('./util/twimlApp');

// Initialize database connection - throws if database connection can't be 
// established
mongoose.connect(config.mongoUrl);

// Create Express web app
var app = require('./webapp');

twimlApp.getTwimlAppSid('Call tracking app').then(function(appSid) {
    console.log('Working with TwiML App SID: ');
    console.log(appSid);
    process.env.TWILIO_APP_SID = appSid;
});

// Create an HTTP server and listen on the configured port
var server = http.createServer(app);
server.listen(config.port, function() {
    console.log('Express server listening on *:' + config.port);
});
