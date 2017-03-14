/**
    Module: marchio
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      killable = require('killable'),
      datastorePost = require('./datastore-post');

/**
 * Module
 * @module marchio
 */

/**
 * 
 * Factory module
 * @module marchio-factory
 */

 /** 
 * Factory method 
 * It takes one spec parameter that must be an object with named parameters
 * @param {Object} spec Named parameters object
 * @returns {Promise} that resolves to {module:marchio}
 * @example <caption>Usage example</caption>

    "use strict";

    var factory = require("marchio");
 
    factory.create({})
    .then( (obj) => obj.health() )
    .catch( (err) => { 
        console.error(err); 
    });
 */
module.exports.create = (spec) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        let _verbose = spec.verbose || false;

        // private 
        let _package = "marchio";
        var _server = null;

        function _log( msg ) {
            if(_verbose) {
                console.log(`[marchio]: ${msg}`);
            }
        }

        resolve({
            // public
            /** Returns the package name
              * @function
              * @instance
              * @memberof module:marchio
            */
            package: () => _package,
            /** Health check
              * @function
              * @instance
              * @memberof module:marchio
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
                var factory = require("marchio");
             
                factory.create()
                .then( (obj) => obj.health() )
                .then( (result) => {
                    console.log("HEALTH: ", result);
                })
                .catch( (err) => { 
                    console.error(err); 
                });
            */
            health: function() {
                return new Promise((resolve,reject) => {
                    resolve("OK");
                });
            },

            /** Use middleware function
              * @function
              * @instance
              * @memberof module:marchio
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
                var factory = require("marchio"),
                    datastore = require(<datastore>)

                var GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID;

                var _testModel = {
                    name: 'user',
                    fields: {
                        email:    { type: String, required: true },
                        status:   { type: String, required: true, default: "NEW" }
                    }
                }

                var _marchio = null;
             
                factory.create({})
                .then( (obj) => _marchio = obj )
                .then( () => 
                    datastore.create({
                        projectId: GOOGLE_TEST_PROJECT,
                        model: _testModel
                    })
                )
                .then( (dsApp) => _marchio.use(dsApp) )
                .catch( function(err) { 
                    console.error(err); 
                });
            */
            use: function( middleware ) {

                return new Promise((resolve, reject) => {

                    if(!middleware) {
                        reject(new Error("marchio.use requires middleware"));
                    }

                    app.use( middleware );

                    resolve();
                });
            },

            /** Listen function
              * @function
              * @instance
              * @memberof module:marchio
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
                var factory = require("marchio"),
                    datastore = require(<datastore>)

                const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
                      PORT = process.env.MARCHIO_PORT || 8080;

                var _testModel = {
                    name: 'user',
                    fields: {
                        email:    { type: String, required: true },
                        status:   { type: String, required: true, default: "NEW" }
                    }
                }

                var _marchio = null;
             
                factory.create({})
                .then( (obj) => _marchio = obj )
                .then( () => 
                    datastore.create({
                        projectId: GOOGLE_TEST_PROJECT,
                        model: _testModel
                    })
                )
                .then( (dsApp) => _marchio.use(dsApp) )
                .then( () => _marchio.listen( { port: PORT } ) )
                .catch( function(err) { 
                    console.error(err); 
                });
            */

            listen: function( arg ) {

                return new Promise((resolve, reject) => {

                    arg = arg || {};

                    var port  = arg.port;

                    if(!port) {
                        reject(new Error("marchio.listen requires port parameter"));
                    }

                    _server = app.listen(port, () => {
                        _log(`listening on port ${port}`);   
                    });

                    killable(_server);
                    resolve();
                });
            },


            /** Close function
              * @function
              * @instance
              * @memberof module:marchio
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
                _marchio.close()
                    .then( () => _marchio.kill() )
                    .catch( (err) => { 
                        console.error(err.message);
                    });
            */
            close: function( arg ) {

                return new Promise((resolve, reject) => {

                    arg = arg || {};

                    if( _server ) {
                        // _server.close();
                        _server.close(function() {
                            _log("closing server"); 
                            resolve();
                        });
                    } else {
                        resolve();
                    }

                });
            },

            /** Kill function
              * @function
              * @instance
              * @memberof module:marchio
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
                _marchio.close()
                    .then( () => _marchio.kill() )
                    .catch( (err) => { 
                        console.error(err.message);
                    });
            */
            kill: function( arg ) {

                return new Promise((resolve, reject) => {

                    arg = arg || {};

                    if( _server ) {
                        // _server.close();
                        _server.kill(function() {
                            _log("killing server");
                            resolve();
                        });

                        _server = null;

                    } else {
                        resolve();
                    }

                });
            }
        });
    });
};
