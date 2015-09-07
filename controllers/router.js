var availableNumbers = require('./availableNumbers');

// Map routes to controller functions
module.exports = function(app) {
    app.get('/available-numbers', availableNumbers.index);
    app.post('/lead-source', availableNumbers.newLeadSource);
    app.get('/lead-source/:id/edit', availableNumbers.editLeadSource);
    app.post('/lead-source/:id/update', availableNumbers.updateLeadSource);
};
