var VoiceResponse = require('twilio/lib/twiml/VoiceResponse');
var _ = require('underscore');

var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');

exports.create = function(request, response) {
  var leadSourceNumber = request.body.To;

  LeadSource.findOne({
    number: leadSourceNumber
  }).then(function(foundLeadSource) {
    var twiml = new VoiceResponse();
    twiml.dial(foundLeadSource.forwardingNumber);

    var newLead = new Lead({
      callerNumber: request.body.From,
      callSid: request.body.CallSid,
      leadSource: foundLeadSource._id,
      city: request.body.FromCity,
      state: request.body.FromState,
      callerName: request.body.CallerName
    });
    return newLead.save()
    .then(function() {
      response.send(twiml.toString());
    });
  }).catch(function(err) {
    console.log('Failed to forward call:');
    console.log(err);
  });
};

exports.leadsByLeadSource = function(request, response) {
  Lead.find()
    .populate('leadSource')
    .then(function(existingLeads) {
      var statsByLeadSource = _.countBy(existingLeads, function(lead) {
          return lead.leadSource.description;
      });

      response.send(statsByLeadSource);
    });
};

exports.leadsByCity = function(request, response) {
  Lead.find().then(function(existingLeads) {
    var statsByCity = _.countBy(existingLeads, 'city');
    response.send(statsByCity);
  });
};
