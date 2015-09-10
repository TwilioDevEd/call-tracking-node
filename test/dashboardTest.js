require('./testHelper');

var cheerio = require('cheerio');
var supertest = require('supertest');
var expect = require('chai').expect;

var app = require('../webapp');
var config = require('../config');
var LeadSource = require('../models/LeadSource');

describe('Dashboard controllers', function() {
    after(function(done) {
        LeadSource.remove({}, done);
    });

    beforeEach(function(done) {
        LeadSource.remove({}, done);
    });

    describe('GET /dashboard', function() {
        it('shows a list of all lead sources', function(done) {

            var testNumber = '+1498324783';
            var testForwardingNumber = '+1982649248';
            var testDescription = 'A description here';

            var newLeadSource = new LeadSource({number: testNumber,
                                                forwardingNumber: testForwardingNumber,
                                                description: testDescription});

            newLeadSource.save()
                .then(function() {
                    var agent = supertest(app);
                    agent.get('/dashboard')
                        .expect(function(response) {
                            expect(response.text).to.contain(testNumber);
                            expect(response.text).to.contain(testForwardingNumber);
                            expect(response.text).to.contain(testDescription);
                        })
                        .expect(200, done);
                });
        });
    });
});
