var LeadSource = require('../models/LeadSource');
var config = require('../config');

exports.show = function(request, response) {
  LeadSource.find().then(function(leadSources) {
    return response.render('dashboard', {
      leadSources: leadSources,
      appSid: config.appSid
    });
  });
};
