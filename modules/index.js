/**
    Module: marchio
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const express = require('express'),
      helmet = require('helmet'),
      killable = require('killable');

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
 * @param {boolean} [spec.verbose=false] Echo debug message to the console
 * @returns {Promise} that resolves to {module:marchio}
 * @example <caption>Usage example</caption>
 * 
 * "use strict";
 *
 * var factory = require("marchio");
 *
 * factory.create({})
 * .then( (obj) => obj.health() )
 * .catch( (err) => { 
 *    console.error(err); 
 * });
 */
module.exports.create = (spec) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        let _verbose = spec.verbose || false;

        // private 
        let _package = "marchio";
        var _server = null;

        const app = express();

        function _log( msg ) {
            if(_verbose) {
                console.log(`[marchio]: ${msg}`);
            }
        }

        resolve({
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
              * "use strict";
              * 
              * var factory = require("marchio");
              *
              * factory.create()
              * .then( (obj) => obj.health() )
              * .then( (result) => {
              *     console.log("HEALTH: ", result);
              * })
              * .catch( (err) => { 
              *     console.error(err); 
              * });
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
              * @param {String} [path] Optional base url (for example: '/api')
              * @param {middleware} middleware ExpressJS middleware function, app, or router
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
              * // $ npm install --save marchio-datastore
              *
              * "use strict";
              *
              * var factory = require("marchio"),
              *     datastore = require('marchio-datastore');
              *
              * var GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID;
              *
              * var _testModel = {
              *     name: 'user',
              *     fields: {
              *         email:    { type: String, required: true },
              *         status:   { type: String, required: true, default: "NEW" }
              *     }
              * };
              *
              * var _marchio = null;
              *
              * factory.create({})
              * .then( (obj) => _marchio = obj )
              * .then( () => 
              *     datastore.create({
              *         projectId: GOOGLE_PROJECT_ID,
              *         model: _testModel,
              *         post: true,
              *         get: true
              *     })
              * )
              * .then( (dsApp) => _marchio.use(dsApp) )
              * .catch( function(err) { 
              *     console.error(err); 
              * });
              * @example <caption>Path Example</caption>
              * // $ npm install --save marchio-datastore
              *
              * "use strict";
              *
              * var factory = require("marchio"),
              *     datastore = require('marchio-datastore');
              *
              * var GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID;
              *
              * var _testModel = {
              *     name: 'user',
              *     fields: {
              *         email:    { type: String, required: true },
              *         status:   { type: String, required: true, default: "NEW" }
              *     }
              * };
              *
              * var _marchio = null;
              *
              * factory.create({})
              * .then( (obj) => _marchio = obj )
              * .then( () => 
              *     datastore.create({
              *         projectId: GOOGLE_PROJECT_ID,
              *         model: _testModel,
              *         post: true,
              *         get: true
              *     })
              * )
              * .then( (dsApp) => _marchio.use( '/api', dsApp ) )
              * .catch( function(err) { 
              *     console.error(err); 
              * });
            */
            use: function( middleware ) {

                return new Promise((resolve, reject) => {

                    if(!middleware) {
                        reject(new Error("marchio.use requires middleware"));
                    }

                    if( typeof arguments[0] === 'string' ) {
                      // app.use( '/path', ... )
                      app.use( arguments[0], Array.prototype.slice.call(arguments, 1) );
                    } else {
                      app.use( middleware );
                    }
                    resolve();
                });
            },

            /** Listen function
              * @function
              * @instance
              * @memberof module:marchio
              * @param {Number} port Port to listen for HTTP requests
              * @returns {Promise}
              * @example <caption>Usage Example</caption>
              * // $ npm install --save marchio-datastore
              *
              * "use strict";
              *
              * var factory = require("marchio"),
              *     datastore = require('marchio-datastore');
              *
              * const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
              *       PORT = process.env.MARCHIO_PORT || 8080;
              *
              * var _testModel = {
              *     name: 'user',
              *     fields: {
              *         email:    { type: String, required: true },
              *         status:   { type: String, required: true, default: "NEW" }
              *     }
              * };
              *
              * var _marchio = null;
              *
              * factory.create({})
              * .then( (obj) => _marchio = obj )
              * .then( () => 
              *    datastore.create({
              *         projectId: GOOGLE_PROJECT_ID,
              *         model: _testModel,
              *         post: true,
              *         get: true
              *     })
              * )
              * .then( (dsApp) => _marchio.use(dsApp) )
              * .then( () => _marchio.listen( PORT ) )
              * .catch( function(err) { 
              *     console.error(err); 
              * });
            */

            listen: function( port ) {

                return new Promise((resolve, reject) => {

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
              * _marchio.close()
              *     .then( () => _marchio.kill() )
              *     .catch( (err) => { 
              *         console.error(err.message);
              *     });
            */
            close: function() {

                return new Promise((resolve, reject) => {
    
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
              * _marchio.close()
              *     .then( () => _marchio.kill() )
              *     .catch( (err) => { 
              *         console.error(err.message);
              *    });
            */
            kill: function() {

                return new Promise((resolve, reject) => {

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
