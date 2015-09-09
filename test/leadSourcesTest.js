var cheerio = require('cheerio');
var supertest = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var vcr = require('nock-vcr-recorder-mocha');

var app = require('../webapp');
var config = require('../config');

describe('Lead sources controllers', function() {

    // Create a MongoDB connection and clear out messages collection before 
    // running tests
    before(function(done) {
        mongoose.connect('mongodb://127.0.0.1/test');
        done();
    });

    after(function(done) {
        done();
    });

    // Test creating a new lead source
    describe('POST /lead-source', function() {
        vcr.it('saves the number after purchase', function(done) {
            var agent = supertest(app);

            agent.post('/lead-source')
                .type('form')
                .send({
                    phoneNumber: '+12568417192'
                })
                .expect(302)
                .end(function(err, res) {
                    done();
                });
        });

        // it('creates a new number in the API', function(done) {

        // });

        // it('redirects to edit page after saving', function(done) {
        //     agent.post('/messages')
        //         .type('form')
        //         .send({
        //             From: '+15556667777',
        //             Body: 'hello world'
        //         })
        //         .expect(200)
        //         .end(function(err, response) {
        //             var $ = cheerio.load(response.text);
        //             expect($('Message').text())
        //                 .to.equal('Message has been received!');
        //             done();
        //         });
        // });
    });

    // describe('GET /lead-source/:id/edit', function() {
    //     it('displays existing values', function(done) {
    //         agent.get('/messages').expect(401, done);
    //     });
    // });

    // describe('POST /lead-source/:id/update', function() {
    //     it('validates the presence of a description', function(done) {
    //         agent.get('/messages')
    //             .auth(config.basic.username, config.basic.password)
    //             .expect(200)
    //             .end(function(err, response) {
    //                 var $ = cheerio.load(response.text);
    //                 expect($('tr').length).to.equal(2);
    //                 done();
    //             });
    //     });

    //     it('validates the presence of a forwarding number', function(done) {

    //     });

    // });
});
