var twilio = require('twilio');
var config = require('../config');
var q = require('q');

var getTwimlAppSid = function(appNameToFind) {

    var appName = appNameToFind || 'Call tracking app';

    if(process.env.TWILIO_APP_SID) {
        return q(process.env.TWILIO_APP_SID);
    }

    var client = twilio(config.accountSid, config.authToken);

    return client.applications.list({friendlyName: appName})
        .then(function(results) {
            if(results.applications.length === 0) {
                throw new Error('No such app');
            }
            else {
                process.env.TWILIO_APP_SID = results.applications[0].sid;
                return results.applications[0].sid;
            }
        })
        .catch(function() {
            return client.applications.create({
                friendlyName: 'Call tracking app',
                voiceCallerIdLookup: true
            })
                .then(function(newApp) {
                    process.env.TWILIO_APP_SID = newApp.sid;
                    return newApp.sid;
                });
        });
};

exports.twimlApp = getTwimlAppSid;
