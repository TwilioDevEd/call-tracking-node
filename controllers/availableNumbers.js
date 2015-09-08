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
        .fail(function(failureToFetchNumbers) {
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
            response.redirect(201, '/lead-source/' + savedLeadSource._id + '/edit');
        })
        .fail(function(numberPurchaseFailure) {
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
                { leadSourceId: foundLeadSource._id,
                  leadSourcePhoneNumber: foundLeadSource.number }
            );
        });
};

var updateLeadSource = function(request, response) {
    var leadSourceId = request.params.id;
    LeadSource.findOne({_id: leadSourceId})
        .then(function(foundLeadSource) {
            foundLeadSource.description = request.body.description;
            foundLeadSource.forwardingNumber = request.body.forwardingNumber;

            return foundLeadSource.save();
        })
        .then(function(savedLeadSource) {
            // Saved successfuly. Redirect
        })
        .fail(function(error) {
            // Failed to save. Do something
        });

};

exports.index = indexAvailableNumbers;
exports.newLeadSource = newLeadSource;
exports.editLeadSource = editLeadSource;
exports.updateLeadSource = updateLeadSource;
