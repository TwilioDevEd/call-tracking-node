var cheerio = require('cheerio');
var supertest = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var vcr = require('nock-vcr-recorder-mocha');

var app = require('../webapp');
var config = require('../config');
var LeadSource = require('../models/leadSource');

describe('Lead sources controllers', function() {

    // Create a MongoDB connection and clears the database after every test

    before(function(done) {
        mongoose.connect('mongodb://127.0.0.1/test');
        done();
    });

    after(function(done) {
        LeadSource.remove({}, done);
    });

    beforeEach(function(done) {
        LeadSource.remove({}, done);
    });

    describe('POST /lead-source', function() {
        vcr.it('saves the number after purchase', function(done) {
            var agent = supertest(app);
            var phoneNumberToPurchase = '+12568417192';

            agent.post('/lead-source')
                .type('form')
                .send({
                    phoneNumber: phoneNumberToPurchase
                })
                .expect(303)
                .expect(function(response) {
                    LeadSource.findOne({ number: phoneNumberToPurchase })
                        .then(function(found) {
                            expect(response.headers.location)
                                .to.equal('/lead-source/' + found._id + '/edit');
                        });
                })
                .end(function(err, res) {
                    done();
                });
        });
    });

    describe('GET /lead-source/:id/edit', function() {
        it('displays existing values', function(done) {
            var agent = supertest(app);
            var phoneNumber = '+155555555';
            var forwardingNumber = '+177777777';
            var leadSource = new LeadSource({ number: phoneNumber,
                                              description: 'Some description',
                                              forwardingNumber: forwardingNumber
                                            });
            leadSource.save().then(function() {
                agent.get('/lead-source/' + leadSource._id + '/edit')
                    .expect(function(response) {
                        var $ = cheerio.load(response.text);
                        expect($('input#description')[0].attribs.value)
                            .to.equal('Some description');
                        expect($('input#forwardingNumber')[0].attribs.value)
                            .to.equal(forwardingNumber);
                    })
                    .expect(200, done);

            });
        });
    });

    describe('POST /lead-source/:id/update', function() {
        it('validates the presence of a description and forwarding number', function(done) {
            var agent = supertest(app);
            var phoneNumber = '+155555555';
            var forwardingNumber = '+177777777';
            var leadSource = new LeadSource({ number: phoneNumber,
                                              description: 'Some description',
                                              forwardingNumber: forwardingNumber
                                            });

            leadSource.save().then(function() {
                var updateUrl = '/lead-source/' + leadSource._id + '/update';
                var editUrl = '/lead-source/' + leadSource._id + '/edit';
                agent.post(updateUrl)
                    .type('form')
                    .send({
                        description: '',
                        forwardingNumber: ''
                    })
                    .expect(function(response) {
                        expect(response.headers.location).to.equal(editUrl);
                    })
                    .expect(303, done);
            });
        });

        it('updates an existing lead source and redirects', function(done) {
            var agent = supertest(app);
            var phoneNumber = '+155555555';
            var newDescription = 'Some new description';
            var newForwardingNumber = '+177777777';
            var leadSource = new LeadSource({ number: phoneNumber });

            leadSource.save().then(function() {
                var updateUrl = '/lead-source/' + leadSource._id + '/update';
                agent.post(updateUrl)
                    .type('form')
                    .send({
                        description: newDescription,
                        forwardingNumber: newForwardingNumber
                    })
                    .expect(function(response) {
                        expect(response.headers.location).to.equal('/dashboard');
                        LeadSource.findOne({ number: phoneNumber })
                            .then(function(foundLeadSource) {
                                expect(foundLeadSource.description)
                                    .to.equal(newDescription);

                                expect(foundLeadSource.forwardingNumber)
                                    .to.equal(newForwardingNumber);
                            });
                    })
                    .expect(303, done);
            });
        });
    });
});
