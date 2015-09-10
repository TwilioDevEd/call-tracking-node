var availableNumbers = require('./availableNumbers');
var leadSources = require('./leadSources');
var leads = require('./leads');
var dashboard = require('./dashboard');

// Map routes to controller functions
module.exports = function(app) {
    app.get('/available-numbers', availableNumbers.index);
    app.post('/lead-source', leadSources.create);
    app.get('/lead-source/:id/edit', leadSources.edit);
    app.post('/lead-source/:id/update', leadSources.update);
    app.get('/dashboard', dashboard.show);
    app.post('/lead', leads.create);
};
