var dotenv = require('dotenv');

//Check .env variables to load
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  dotenv.config({path: '.env'});
} else {
  dotenv.config({path: '.env.test', silent: true});
}

var twimlApp = require('./util/twimlApp');
var cfg = {};


// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000;

// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'keyboard cat';

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
//
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;

// Read in a TwiML app SID from the system environment, or create one to use
// in this application
twimlApp.getTwimlAppSid('Call tracking app').then(function(appSid) {
  console.log('Working with TwiML App SID: ');
  console.log(appSid);
  process.env.TWILIO_APP_SID = appSid;
  cfg.appSid = process.env.TWILIO_APP_SID;
});

// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL;

// Ensure all required configuration is set
var configured = [
  cfg.accountSid, 
  cfg.authToken, 
  cfg.mongoUrl
].every(function(configValue) {
  if (configValue) {
    return true;
  }
});

if (!configured) {
  var s = 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and MONGO_URL must be set';
  throw new Error(s);
}

// Export configuration object
module.exports = cfg;
