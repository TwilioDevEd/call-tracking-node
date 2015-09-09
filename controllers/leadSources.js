var twilio = require('twilio');
var config = require('../config');
var LeadSource = require('../models/leadSource');

var create = function(request, response) {
    var phoneNumberToPurchase = request.body.phoneNumber;
    var client = twilio(config.accountSid, config.authToken);

    client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumberToPurchase,
        voiceCallerIdLookup: true,
        voiceApplicationSid: config.appSid
    })
        .then(function(purchasedNumber) {
            var leadSource = new LeadSource({ number: purchasedNumber.phoneNumber });
            return leadSource.save();
        })
        .then(function(savedLeadSource) {
            console.log('Saving lead source');
            response.redirect(303, '/lead-source/' + savedLeadSource._id + '/edit');
        })
        .catch(function(numberPurchaseFailure) {
            console.log('Could not purchase a number for lead source:');
            console.log(numberPurchaseFailure);
            response.status(500).send('Could not contact Twilio API');
        });
};

var edit = function(request, response) {
    var leadSourceId = request.params.id;
    LeadSource.findOne({ _id: leadSourceId })
        .then(function(foundLeadSource) {
            return response.render(
                'editLeadSource',
                {
                  leadSourceId: foundLeadSource._id,
                  leadSourcePhoneNumber: foundLeadSource.number,
                  leadSourceForwardingNumber: foundLeadSource.forwardingNumber,
                  leadSourceDescription: foundLeadSource.description,
                  messages: request.flash('error')
                }
            );
        })
        .catch(function() {
            return response.status(404).send('No such lead source');
        });
};

var update = function(request, response) {
    var leadSourceId = request.params.id;

    request.checkBody('description', 'Description cannot be empty').notEmpty();
    request.checkBody('forwardingNumber', 'Forwarding number cannot be empty').notEmpty();

    if(request.validationErrors()) {
        request.flash('error', request.validationErrors());
        return response.redirect(303, '/lead-source/' + leadSourceId + '/edit');
    }

    LeadSource.findOne({ _id: leadSourceId })
        .then(function(foundLeadSource) {
            foundLeadSource.description = request.body.description;
            foundLeadSource.forwardingNumber = request.body.forwardingNumber;

            return foundLeadSource.save();
        })
        .then(function(savedLeadSource) {
            return response.redirect(303, '/available-numbers');
        })
        .catch(function(error) {
            return response.status(500).send('Could not save the lead source');
        });

};

exports.create = create;
exports.edit = edit;
exports.update = update;
