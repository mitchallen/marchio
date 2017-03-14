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
    datastoreGet = require('../modules/datastore-get'),
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
            .then( () => { 
                _marchio.kill();
            })
            .then( () => { 
                done();
            })
            .catch( (err) => { 
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

    it('create method with no spec should return object', done => {
        _factory.create()
        .then( (obj)=> {
            should.exist(obj);
            done();
        })
        .catch( (err) => {  
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('health method should return ok', done => {
        _factory.create()
        .then( (obj) => {
            return obj.health();
        })
        .then( (result) => {
            result.should.eql("OK");
            done();
        })
        .catch( (err) => { 
            console.error(err.message);
            done(err); 
        });
    });

    it('use method with valid properties should return object', done => {

        _factory.create( { 
            verbose: true 
        })
        .then( (obj) => {
            _marchio = obj;
            return datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then( (dsApp) => {
            should.exist(dsApp);
            _marchio.use(dsApp);
            done();
        })
        .catch( function(err) { ; 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.post should succeed', done => {

        _factory.create( {
            verbose: false
        })
        .then( (obj) => {
            _marchio = obj;
            return datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => {
            return _marchio.listen( { port: TEST_PORT } )
        })
        .then( () => {

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

        _factory.create( {
            verbose: false
        })
        .then( (obj) => {
            _marchio = obj;
            return datastorePost.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then( (dsPostRouter) => {
            should.exist(dsPostRouter);
            return _marchio.use(dsPostRouter);
        })
        .then( () => {
            return _marchio.listen( { port: TEST_PORT } )
        })
        .then( () => {

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

    it('datastore-get should succeed', done => {

        _factory.create( {
            verbose: false
        })
        .then( (obj) => {
            _marchio = obj;
            return datastoreGet.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel
            });
        })
        .then( (dsPostRouter) => {
            should.exist(dsPostRouter);
            return _marchio.use(dsPostRouter);
        })
        .then( () => {
            _marchio.listen( { port: TEST_PORT } )
        })
        .then(function() {

            var testObject = {
                email: "test@example.com"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // TODO - get this from a post operations
            var _recordId = '5067160539889664'; // TEMP hard-coded

            var _getUrl = `/${_testModel.name}/${_recordId}`;

            console.log(_getUrl);

            request(_testHost)
                .get(_getUrl)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    console.log(res.body);
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
