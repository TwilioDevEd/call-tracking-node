var mongoose = require('mongoose');

exports.mongoConnection = mongoose.connect('mongodb://127.0.0.1/test');
