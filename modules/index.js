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
    var factory = require("marchio");
 
    factory.create({})
    .then(function(obj) {
        return obj.health();
    })
    .catch( function(err) { 
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
              * @example <caption>Usage Example</caption>
                var factory = require("marchio");
             
                factory.create({})
                .then(function(obj) {
                    return obj.health();
                })
                .then(function(result) {
                    console.log("HEALTH: ", result);
                })
                .catch( function(err) { 
                    console.error(err); 
                });
            */
            health: function() {
                return new Promise((resolve,reject) => {
                    resolve("OK");
                });
            },

            use: function( middleware ) {

                return new Promise((resolve, reject) => {

                    if(!middleware) {
                        reject(new Error("marchio.use requires middleware"));
                    }

                    app.use( middleware );

                    resolve(app);
                });
            },

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
                    resolve(_server);
                });
            },

            close: function( arg ) {

                return new Promise((resolve, reject) => {

                    arg = arg || {};

                    if( _server ) {
                        // _server.close();
                        _server.close(function() {
                            _log("closing server"); 
                            resolve(app);
                        });
                    } else {
                        resolve(app);
                    }

                });
            },

            kill: function( arg ) {

                return new Promise((resolve, reject) => {

                    arg = arg || {};

                    if( _server ) {
                        // _server.close();
                        _server.kill(function() {
                            _log("killing server");
                            resolve(app);
                        });

                        _server = null;

                    } else {
                        resolve(app);
                    }

                });
            }
        });
    });
};
