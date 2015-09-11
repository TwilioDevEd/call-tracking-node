var twilio = require('twilio');
var config = require('../config');

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

exports.index = indexAvailableNumbers;
