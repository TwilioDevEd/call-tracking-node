var dotenv = require('dotenv');
var twimlApp = require('./util/twimlApp');
var cfg = {};

if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    dotenv.config({path: '.env'});
}
else {
    dotenv.config({path: '.env.test'});
}

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000;

// HTTP Basic auth config, for light weight security on our demo app
cfg.basic = {
    username: process.env.HTTP_BASIC_USERNAME || 'admin',
    password: process.env.HTTP_BASIC_PASSWORD || 'password'
};

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

twimlApp.getTwimlAppSid('Call tracking app').then(function(appSid) {
    console.log('Working with TwiML App SID: ');
    console.log(appSid);
    process.env.TWILIO_APP_SID = appSid;
    cfg.appSid = process.env.TWILIO_APP_SID;
});


// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL;

var configured = [cfg.accountSid, cfg.authToken, cfg.mongoUrl].every(function(configValue) {
    if(configValue) {
        return true;
    }
});

if(!configured) {
    throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and MONGO_URL must be set');
}


// Export configuration object
module.exports = cfg;
