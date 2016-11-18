// Do not allow the application to run if env vars not set in .env file
require('dotenv-safe').load();

var env = process.env;

module.exports = {
  // HTTP Port to run our web application
  port: env.port || 3000,
  // A random string that will help generate secure one-time passwords and
  // HTTP sessions
  secret: env.APP_SECRET || 'keyboard cat',
  accountSid: env.TWILIO_ACCOUNT_SID,
  authToken: env.TWILIO_AUTH_TOKEN,
  appSid: env.TWILIO_APP_SID,
  // MongoDB connection string - MONGO_URL is for local dev,
  // MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
  mongoUrl: process.env.MONGOLAB_URI || process.env.MONGO_URL,
};
