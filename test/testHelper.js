var mongoose = require('mongoose');
mongoose.Promise = Promise;

var connStr = process.env.MONGO_URL

var conn;

if (mongoose.connections.length == 0) {
  conn = mongoose.connect(connStr);
} else {
  if (!mongoose.connections[0].host) {
    conn = mongoose.connect(connStr);
  }
}

exports.mongoConnection = conn;
