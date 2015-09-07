var twilio = require('twilio');
var config = require('../config');
var LeadSource = require('../models/LeadSource');

var indexAvailableNumbers = function(request, response) {
    client = twilio(config.accountSid, config.authToken);

    var areaCode = request.query.areaCode;

    client.availablePhoneNumbers('US').local.list({'areaCode': areaCode})
        .then(function(availableNumbers) {
            response.render(
                'availableNumbers',
                {'availableNumbers': availableNumbers.availablePhoneNumbers}
            );
        });
};

var purchasePhoneNumber = function(request, response) {
    var phoneNumberToPurchase = request.body.phoneNumber;
    client = twilio(config.accountSid, config.authToken);

    client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumberToPurchase,
        voiceCallerIdLookup: true
    })
        .then(function(purchasedNumber) {
            var leadSource = new LeadSource({number: purchasedNumber.phone_number});
            return leadSource.save();
        })
        .then(function(savedLeadSource) {
            console.log(savedLeadSource);
        })
        .fail(function(numberPurchaseFailure) {
            console.log(numberPurchaseFailure);
        });
};

var editLeadSource = function(request, response) {
};

exports.index = indexAvailableNumbers;
exports.purchasePhoneNumber = purchasePhoneNumber;
