var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');

var twilio = require('twilio');
var _ = require('underscore');

var create = function(request, response) {
  var leadSourceNumber = request.body.To;

  LeadSource.findOne({number: leadSourceNumber})
        .then(function(foundLeadSource) {
          var twiml = new twilio.TwimlResponse();
          twiml.dial(foundLeadSource.forwardingNumber);
          response.send(twiml.toString());

          var newLead = new Lead({callerNumber: request.body.From,
                                   callSid: request.body.CallSid,
                                   leadSource: foundLeadSource._id,
                                   city: request.body.FromCity,
                                   state: request.body.FromState,
                                   callerName: request.body.CallerName});

          return newLead.save();
        })
        .catch(function(err) {
          console.log('Failed to forward call:');
          console.log(err);
        });
};

var leadsByLeadSource = function(request, response) {
  Lead.find({})
      .populate('leadSource')
        .then(function(existingLeads) {
          var statsByLeadSource = _.countBy(existingLeads, function(lead) {
            return lead.leadSource.description;
          });

          response.set('Content-Type', 'application/json');
          return response.send(statsByLeadSource);
        });
};

var leadsByCity = function(request, response) {
  Lead.find({})
        .then(function(existingLeads) {
          var statsByCity = _.countBy(existingLeads, 'city');

          response.set('Content-Type', 'application/json');
          return response.send(statsByCity);
        });
};

exports.create = create;
exports.leadsByLeadSource = leadsByLeadSource;
exports.leadsByCity = leadsByCity;
