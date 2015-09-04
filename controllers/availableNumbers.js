var twilio = require('twilio');
var config = require('../config');

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
};

exports.index = indexAvailableNumbers;
exports.purchasePhoneNumber = purchasePhoneNumber;
