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
  apiKey: env.TWILIO_API_KEY,
  apiSecret: env.TWILIO_API_SECRET,
  appSid: env.TWILIO_APP_SID,
  mongoUrl: env.MONGO_URL
};
