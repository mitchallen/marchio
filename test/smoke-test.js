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
    datastore = require('marchio-datastore'),
    modulePath = "../modules/index",
    GOOGLE_TEST_PROJECT = process.env.MARCHIO_TEST_GOOGLE_PROJECT,
    // TEST_PORT = process.env.TEST_PORT || 8080;
    TEST_PORT = 8080;

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

describe('module factory smoke test', () => {

    var _factory = null;

    var _marchio = null;

    var _testModel = {
        name: 'smoketest',
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            password: { type: String, select: false },  // select: false, exclude from query results
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
            .then( () => _marchio.kill() )
            .then( () => done() )
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
        .then( (obj) => should.exist(obj) )
        .then( () => done() )
        .catch( (err) => {  
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('health method should return ok', done => {
        _factory.create()
        .then( (obj) => obj.health() )
        .then( (result) => result.should.eql("OK") )
        .then( () => done() )
        .catch( (err) => { 
            console.error(err.message);
            done(err); 
        });
    });

    it('use method with valid properties should return object', done => {

        _factory.create( { verbose: true }) 
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            _marchio.use(dsApp);
        })
        .then( () => done() )
        .catch( function(err) { ; 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.post should succeed', done => {

        _factory.create( {
            verbose: false
        })
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => _marchio.listen( TEST_PORT ) )
        .then( () => {

            var testObject = {
                email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
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

    it('datastore.get should succeed', done => {

        _factory.create( {
            verbose: false
        })
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true,
                get: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => _marchio.listen( { port: TEST_PORT } ) )
        .then( () => {

            var testObject = {
                email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // GET
                    var _recordId = res.body._id; 
                    var _getUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log(_getUrl);
                    request(_testHost)
                        .get(_getUrl)
                        .expect(200)
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
                });

        })
        .catch( function(err) { 
            console.error(err.message);
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.put should succeed', done => {
        _factory.create( {
            verbose: false
        })
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true,
                get: true,
                put: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => _marchio.listen( { port: TEST_PORT } ) )
        .then( () => {

            var testObject = {
                email: "testput" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                password: "fubar"
            };

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // PUT
                    var _recordId = res.body._id; 
                    var _putUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log("PUT URL: ", _putUrl);
                    request(_testHost)
                        .put(_putUrl)
                        // PROBLEM: hashed password is not included and Datastore doesn't do partial updates
                        .send({ email: testObject.email, status: "UPDATED" })
                        // .send({ status: "UPDATED" })
                        .set('Content-Type', 'application/json')
                        .expect(204)    // No content returned
                        .end(function (err, res) {
                            should.not.exist(err);
                            // No content, nothing to verify
                            var _getUrl = `/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                // Get ALL fields, verify password intact.
                                .query( { fields: 'email password status'} )
                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log("RECORD: ", res.body);
                                    res.body.email.should.eql(testObject.email);
                                    // Should return password based on fields query
                                    should.exist(res.body.password);
                                    // In production the password would be hashed and would not match
                                    res.body.password.should.eql(testObject.password);
                                    res.body.status.should.eql("UPDATED");
                                    should.exist(res.body._id);
                                    done();;
                                });
                        });
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.delete should succeed', done => {
        _factory.create( {
            verbose: false
        })
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true,
                get: true,
                del: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => _marchio.listen( { port: TEST_PORT } ) )
        .then( () => {

            var testObject = {
                email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // DELETE
                    var _recordId = res.body._id; 
                    var _delUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log("DEL URL: ", _delUrl);
                    request(_testHost)
                        .del(_delUrl)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.status.should.eql("OK");
                            // GET (make sure it's gone - expect 404)
                            var _getUrl = `/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                .expect(404)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log(res.body);
                                    res.body.error.should.containEql('not found');
                                    done();;
                                });
                        });
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('datastore.patch should succeed', done => {
        _factory.create( {
            verbose: false
        })
        .then( (obj) => _marchio = obj )
        .then( () => 
            datastore.create({
                projectId: GOOGLE_TEST_PROJECT,
                model: _testModel,
                post: true,
                get: true,
                patch: true
            })
        )
        .then( (dsApp) => {
            should.exist(dsApp);
            return _marchio.use(dsApp);
        })
        .then( () => _marchio.listen( { port: TEST_PORT } ) )
        .then( () => {

            var testObject = {
                email: "testpatch" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                password: "fubar"
            };

            var patchStatus = "UPDATED PATCH STATUS",
                testPatch = [
                    // { "op": "remove", "path": "/password" }
                    {"op": "replace", "path": "/status", "value": patchStatus }
                ];

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // PATCH
                    var _recordId = res.body._id; 
                    var _patchUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log("PATCH URL: ", _patchUrl);
                    request(_testHost)
                        .patch(_patchUrl)
                        .send( testPatch )
                        .set('Content-Type', 'application/json')
                        .expect(204)  
                        .end(function (err, res) {
                            should.not.exist(err);
                            // GET
                            var _getUrl = `/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log("RECORD: ", res.body);
                                    res.body.email.should.eql(testObject.email);
                                    // // Should not return password
                                    should.not.exist(res.body.password);
                                    res.body.status.should.eql(patchStatus);
                                    should.exist(res.body._id);
                                    done();;
                                });
                        });
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });


});
