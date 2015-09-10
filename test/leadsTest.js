require('./testHelper');

var supertest = require('supertest');
var expect = require('chai').expect;

var app = require('../webapp');
var config = require('../config');
var LeadSource = require('../models/leadSource');
var Lead = require('../models/Lead');

describe('Lead controllers', function() {
    after(function(done) {
        Lead.remove({})
            .then(function() {
                LeadSource.remove({}, done);
            });
    });

    beforeEach(function(done) {
        Lead.remove({})
            .then(function() {
                LeadSource.remove({}, done);
            });
    });

    describe('POST /lead', function() {
        var agent = supertest(app);
        var callerNumber = '+1248623948';
        var callSid = '5up3runiqu3c411s1d';
        var city = 'Some city';
        var state = 'Some state';
        var callerName = 'Someone';

        var leadSourceNumber = '+149372894';
        var leadSourceDescription = 'Some description';
        var leadSourceForwardingNumber = '+132947845';

        it('forwards the call to a different number', function(done) {
            var newLeadSource = new LeadSource({number: leadSourceNumber,
                                                description: leadSourceDescription,
                                                forwardingNumber: leadSourceForwardingNumber
                                               });
            newLeadSource.save()
                .then(function() {
                    agent.post('/lead')
                        .type('form')
                        .send({
                            From: callerNumber,
                            To: leadSourceNumber,
                            CallSid: callSid,
                            FromCity: city,
                            FromState: state,
                            CallerName: callerName
                        })
                        .expect(function(response) {
                            expect(response.text).to.contain(
                                '<Dial>' + leadSourceForwardingNumber.toString() + '</Dial>');
                        })
                        .expect(200, done);
                });
        });

        it('records a new lead', function(done) {
            var newLeadSource = new LeadSource({number: leadSourceNumber,
                                                description: leadSourceDescription,
                                                forwardingNumber: leadSourceForwardingNumber
                                               });
            newLeadSource.save()
                .then(function(savedLeadSource) {
                    agent.post('/lead')
                        .type('form')
                        .send({
                            From: callerNumber,
                            To: leadSourceNumber,
                            CallSid: callSid,
                            FromCity: city,
                            FromState: state,
                            CallerName: callerName
                        })
                        .expect(function(response) {
                            Lead.findOne({})
                                .then(function(newLead) {
                                    expect(newLead.callerNumber).to.equal(callerNumber);
                                    expect(newLead.leadSource.toString()).to.equal(savedLeadSource._id.toString());
                                    expect(newLead.city).to.equal(city);
                                    expect(newLead.state).to.equal(state);
                                    expect(newLead.callerName).to.equal(callerName);
                                });
                        })
                        .expect(200, done);
                });

        });
    });

});
