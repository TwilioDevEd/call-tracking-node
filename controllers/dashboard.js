var LeadSource = require('../models/LeadSource');
var config = require('../config');

var show = function(request, response) {
    LeadSource.find({})
        .then(function(leadSources){
            return response.render('dashboard',
                                   { leadSources: leadSources,
                                     appSid: config.appSid
                                   });
        });
};

exports.show = show;
