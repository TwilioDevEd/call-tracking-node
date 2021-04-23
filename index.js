var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');

var connectionString = config.mongoUrl || "mongodb://localhost/call-tracking";

// Initialize database connection - throws if database connection can't be
// established
mongoose.connect(connectionString, { useMongoClient: true });
mongoose.Promise = Promise;

// Create Express web app
var app = require('./webapp');

// Create an HTTP server and listen on the configured port
var server = http.createServer(app);
server.listen(config.port, function() {
  console.log('Express server listening on *:' + config.port);
});
