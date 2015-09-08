var twilio = require('twilio');
var config = require('../config');
var LeadSource = require('../models/LeadSource');

var indexAvailableNumbers = function(request, response) {
    var client = twilio(config.accountSid, config.authToken);

    var areaCode = request.query.areaCode;

    client.availablePhoneNumbers('US').local.list({'areaCode': areaCode})
        .then(function(availableNumbers) {
            response.render(
                'availableNumbers',
                {'availableNumbers': availableNumbers.availablePhoneNumbers}
            );
        })
        .catch(function(failureToFetchNumbers) {
            console.log('Failed to fetch numbers from API');
            console.log('Error was:');
            console.log(failureToFetchNumbers);
            response.status(500).send('Could not contact Twilio API');
        });
};

var newLeadSource = function(request, response) {
    var phoneNumberToPurchase = request.body.phoneNumber;
    var client = twilio(config.accountSid, config.authToken);

    client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumberToPurchase,
        voiceCallerIdLookup: true,
        voiceApplicationSid: config.appSid
    })
        .then(function(purchasedNumber) {
            var leadSource = new LeadSource({number: phoneNumberToPurchase});
            return leadSource.save();
        })
        .then(function(savedLeadSource) {
            console.log('Saving lead source:');
            console.log(savedLeadSource);
            response.redirect(302, '/lead-source/' + savedLeadSource._id + '/edit');
        })
        .catch(function(numberPurchaseFailure) {
            console.log('Could not purchase a number for lead source:');
            console.log(numberPurchaseFailure);
            response.status(500).send('Could not contact Twilio API');
        });
};

var editLeadSource = function(request, response) {
    var leadSourceId = request.params.id;
    LeadSource.findOne({ _id: leadSourceId })
        .then(function(foundLeadSource) {
            response.render(
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
            response.status(404).send('No such lead source');
        });
};

var updateLeadSource = function(request, response) {
    var leadSourceId = request.params.id;

    request.checkBody('description', 'Description cannot be empty').notEmpty();
    request.checkBody('forwardingNumber', 'Forwarding number cannot be empty').notEmpty();

    if(request.validationErrors()) {
        request.flash('error', request.validationErrors());
        response.redirect(303, '/lead-source/' + leadSourceId + '/edit');
    }

    LeadSource.findOne({ _id: leadSourceId })
        .then(function(foundLeadSource) {
            foundLeadSource.description = request.body.description;
            foundLeadSource.forwardingNumber = request.body.forwardingNumber;

            return foundLeadSource.save();
        })
        .then(function(savedLeadSource) {
            response.redirect(303, '/available-numbers');
        })
        .catch(function(error) {
            response.status(500).send('Could not save the lead source');
        });

};

exports.index = indexAvailableNumbers;
exports.newLeadSource = newLeadSource;
exports.editLeadSource = editLeadSource;
exports.updateLeadSource = updateLeadSource;
