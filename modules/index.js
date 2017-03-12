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
      PORT = process.env.PORT || 8080,
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
module.exports.Datastore = (spec) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        var model = spec.model,
            projectId = spec.projectId,
            use = spec.use || [];

        if( ! model ) {
            reject(new Error("### ERROR: Datastore model must be defined" ) );
            // return null;
        }

        if( ! model.name ) {
            reject(new Error("### ERROR: Datastore model.name must be defined"));
            // return null;
        }

        if( ! projectId ) {
            reject(new Error("### ERROR: Datastore projectId must be defined"));
            // return null;
        }

        model.fields = model.fields || {};

        // reject("reason");

        // private 
        let _package = "marchio";

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

            post: function() {
                app.use( datastorePost.create({ 
                    projectId: projectId,
                    model: model,
                    // use: [ preprocess ]
                  }));
            }
        });
    });
};
