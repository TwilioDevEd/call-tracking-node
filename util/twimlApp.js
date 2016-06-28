var twilio = require('twilio');
var config = require('../config');
var q = require('q');

var getTwimlAppSid = function(appNameToFind) {
  // Create reusable Twilio API client
  var client = twilio(config.accountSid, config.authToken);
  var appName = appNameToFind || 'Call tracking app';

  if (process.env.TWILIO_APP_SID) {
    return q(process.env.TWILIO_APP_SID);
  }

  return client.applications.list({
    friendlyName: appName
  }).then(function(results) {
    if (results.applications.length === 0) {
      throw new Error('No such app');
    } else {
      return results.applications[0].sid;
    }
  }).catch(function() {
    return client.applications.create({
      friendlyName: 'Call tracking app',
      voiceCallerIdLookup: true
    }).then(function(newApp) {
      return newApp.sid;
    });
  });
};

exports.getTwimlAppSid = getTwimlAppSid;
