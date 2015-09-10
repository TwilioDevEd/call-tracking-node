var LeadSource = require('../models/leadSource');
var Lead = require('../models/Lead');
var config = require('../config');

var twilio = require('twilio');

var create = function(request, response) {
    var leadSourceNumber = request.body.To;

    LeadSource.findOne({number: leadSourceNumber})
        .then(function(foundLeadSource) {
            var twiml = new twilio.TwimlResponse();
            twiml.dial(foundLeadSource.forwardingNumber);
            response.send(twiml.toString());

            var newLead = new Lead({ callerNumber: request.body.From,
                                     callSid: request.body.CallSid,
                                     city: request.body.FromCity,
                                     state: request.body.FromState,
                                     callerName: request.body.CallerName });

            return newLead.save();
        })
        .then(function(savedLead) {
            console.log('Saved new lead:');
            console.log(savedLead);
        })
        .catch(function(err) {
            console.log('Failed to forward call:');
            console.log(err);
        });
};

var leadsByLeadSource = function(request, response) {

};

var leadsByCity = function(request, response) {

};

exports.create = create;
