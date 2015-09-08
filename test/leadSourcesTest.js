var cheerio = require('cheerio');
var supertest = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var app = require('../webapp');
var config = require('../config');
var LeadSource = require('../models/LeadSource');

describe('Lead sources controllers', function() {
    var agent = supertest(app);

    // Create a MongoDB connection and clear out messages collection before 
    // running tests
    before(function(done) {
        mongoose.connect('mongodb://127.0.0.1/test');
        LeadSource.remove({}, done);
    });

    // Test creating a message
    describe('POST /lead-source', function() {
        it('saves the number after purchase', function(done) {
            agent.post('/lead-source').expect(200).end(function(err, response) {
                var $ = cheerio.load(response.text);
                expect($('Message').text())
                    .to.equal('Oops, there was a problem.');
                done();
            });
        });

        it('creates a new number in the API', function(done) {

        });

        it('redirects to edit page after saving', function(done) {
            agent.post('/messages')
                .type('form')
                .send({
                    From: '+15556667777',
                    Body: 'hello world'
                })
                .expect(200)
                .end(function(err, response) {
                    var $ = cheerio.load(response.text);
                    expect($('Message').text())
                        .to.equal('Message has been received!');
                    done();
                });
        });
    });

    describe('GET /lead-source/:id/edit', function() {
        it('displays existing values', function(done) {
            agent.get('/messages').expect(401, done);
        });
    });

    describe('POST /lead-source/:id/update', function() {
        it('validates the presence of a description', function(done) {
            agent.get('/messages')
                .auth(config.basic.username, config.basic.password)
                .expect(200)
                .end(function(err, response) {
                    var $ = cheerio.load(response.text);
                    expect($('tr').length).to.equal(2);
                    done();
                });
        });

        it('validates the presence of a forwarding number', function(done) {

        });

    });
});
