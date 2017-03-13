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
    datastore = require('../modules/datastore'),
    datastorePost = require('../modules/datastore-post'),
    modulePath = "../modules/index",
    GOOGLE_TEST_PROJECT = process.env.MARCHIO_TEST_GOOGLE_PROJECT,
    // TEST_PORT = process.env.TEST_PORT || 8080;
    TEST_PORT = 8080;

describe('module factory smoke test', () => {

    var _factory = null;

    var _marchio = null;

    var _testModel = {
        name: 'user',
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    }

    var _testHost = `http://localhost:${TEST_PORT}`;
    var _postUrl = `/${_testModel.name}`;

    before( done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after( done => {
        // Call after all tests
        // console.log("AFTER");
        done();
    });

    beforeEach( done => {
        // Call before each test
        _marchio = null;
        done();
    });

    afterEach( done => {
        // Call after each test
        // console.log("AFTER EACH");
        if(_marchio) {
            _marchio.close()
            .then(function() { 
                return _marchio.kill();
            })
            .then(function() { 
                done();
            })
            .catch( function(err) { 
                console.error(err.message);
                done(err);  // to pass on err, remove err (done() - no arguments)
            });
        } else {
            done();
        }
        
    });

    it('module should exist', done => {
        should.exist(_factory);
        done();
    });

    it('create method with no spec should return objrvy', done => {
        _factory.create()
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

    it('health method should return ok', done => {
        _factory.create()
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

    it('use method with valid properties should return object', done => {

        _factory.create( { 
            verbose: true 
        })
        .then(function(obj) {
            _marchio = obj;
            return datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then(function(datastoreApp){
            should.exist(datastoreApp);
            _marchio.use(datastoreApp);
            done();
        })
        .catch( function(err) { 
            // console.error(err); 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.post should succeed', done => {

        var marchio = null;
        _factory.create( {
            verbose: false
        })
        .then(function(obj) {
            _marchio = obj;
            return datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then(function(datastoreApp){
            should.exist(datastoreApp);
            return _marchio.use(datastoreApp);
        })
        .then(function(app){
            should.exist(app);
            return _marchio.listen( { port: TEST_PORT } )
        })
        .then(function() {

            var testObject = {
                email: "test@example.com"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    // // Should not return password
                    // should.not.exist(res.body.password);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    done();;
                });

        })
        .catch( function(err) { 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore-post should succeed', done => {

        var marchio = null;
        _factory.create( {
            verbose: false
        })
        .then(function(obj) {
            _marchio = obj;
            return datastorePost.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then(function(datastorePostRouter){
            should.exist(datastorePostRouter);
            return _marchio.use(datastorePostRouter);
        })
        .then(function(app){
            should.exist(app);
            return _marchio.listen( { port: TEST_PORT } )
        })
        .then(function() {

            var testObject = {
                email: "testpost@example.com"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    // // Should not return password
                    // should.not.exist(res.body.password);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    done();;
                });

        })
        .catch( function(err) { 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });


});
