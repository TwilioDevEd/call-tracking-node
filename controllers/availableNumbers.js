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
        voiceApplicationSid: cfg.appSid
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
    response.render(
        'editLeadSource',
        {'leadSourceId': leadSourceId,
         'leadSourcePhoneNumber': '+43242353454'}
    );
};

var updateLeadSource = function(request, response) {

};

exports.index = indexAvailableNumbers;
exports.newLeadSource = newLeadSource;
exports.editLeadSource = editLeadSource;
exports.updateLeadSource = updateLeadSource;
