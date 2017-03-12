/**
    Module: marchio
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint mocha: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = "../modules/index",
    GOOGLE_TEST_PROJECT = process.env.MARCHIO_TEST_GOOGLE_PROJECT;

describe('module factory smoke test', () => {

    var _factory = null;

    var _testModel = {
        name: "smoke",
        fields: []
    };

    before( done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after( done => {
        // Call after all tests
        done();
    });

    beforeEach( done => {
        // Call before each test
        done();
    });

    afterEach( done => {
        // Call after eeach test
        done();
    });

    it('module should exist', done => {
        should.exist(_factory);
        done();
    });

    it('Datastore method with no spec should return error', done => {
        _factory.Datastore({})
        .then(function(obj){
            should.exist(obj);
            done(new Error("ERROR: object should not exist"));
        })
        .catch( function(err) { 
            // console.error(err); 
            console.error(err.message);
            done();  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('Datastore method with valid properties should return object', done => {
        // console.log(`GOOGLE_TEST_PROJECT: ${GOOGLE_TEST_PROJECT}`);
        _factory.Datastore({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            // console.error(err); 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('Datastore health method should return ok', done => {
        _factory.Datastore({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel
        })
        .then(function(obj) {
            return obj.health();
        })
        .then(function(result) {
            result.should.eql("OK");
            done();
        })
        .catch( function(err) { 
            // console.error(err); 
            console.error(err.message);
            done(err); 
        });
    });
});
