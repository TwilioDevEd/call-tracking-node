var availableNumbers = require('./availableNumbers');

// Map routes to controller functions
module.exports = function(app) {
    app.get('/available-numbers', availableNumbers.index);
    app.post('/phone-number', availableNumbers.purchasePhoneNumber);
};
