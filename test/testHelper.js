var mongoose = require('mongoose');
mongoose.Promise = Promise;

var connStr = 'mongodb://localhost/call-tracking-testdb';

var conn;

if (mongoose.connections.length == 0) {
  conn = mongoose.connect(connStr);
} else {
  if (!mongoose.connections[0].host) {
    conn = mongoose.connect(connStr);
  }
}

exports.mongoConnection = conn;
