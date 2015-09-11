var availableNumbers = require('./availableNumbers');
var leadSources = require('./leadSources');
var leads = require('./leads');
var dashboard = require('./dashboard');

// Map routes to controller functions
module.exports.webRoutes = function(router) {
  router.get('/', function(req, resp) { return resp.redirect(302, '/dashboard'); });
  router.get('/available-numbers', availableNumbers.index);
  router.post('/lead-source', leadSources.create);
  router.get('/lead-source/:id/edit', leadSources.edit);
  router.post('/lead-source/:id/update', leadSources.update);
  router.get('/dashboard', dashboard.show);
  router.get('/lead/summary-by-lead-source', leads.leadsByLeadSource);
  router.get('/lead/summary-by-city', leads.leadsByCity);
};

module.exports.webhookRoutes = function(router) {
  router.post('/lead', leads.create);
};
