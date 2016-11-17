var mongoose = require('mongoose');

var LeadSourceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  forwardingNumber: {
    type: String,
    required: false
  }
});

delete mongoose.models.LeadSource

// Create a Mongoose model from our schema
var LeadSource = mongoose.model('LeadSource', LeadSourceSchema);

// export model as our module interface
module.exports = LeadSource;
