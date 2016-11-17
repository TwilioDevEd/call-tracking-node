// Do not allow the application to run if env vars not set in .env file
require('dotenv-safe').load();

var cfg = {};

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000;

// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'keyboard cat';

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.appSid = process.env.TWILIO_APP_SID;

// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL;

// Export configuration object
module.exports = cfg;
