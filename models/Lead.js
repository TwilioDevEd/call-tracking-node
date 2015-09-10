var mongoose = require('mongoose');

var LeadSchema = new mongoose.Schema({
    callerNumber: {type: String, required: true},
    callSid: {type: String, required: true},
    leadSource: {type: mongoose.Schema.Types.ObjectId, ref: 'LeadSource'},
    city: {type: String, required: false},
    state: {type: String, required: false},
    callerName: {type: String, required: false}
});

// Create a Mongoose model from our schema
var Lead = mongoose.model('Lead', LeadSchema);

// export model as our module interface
module.exports = Lead;
