/**
    Module: datastore-core.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      datastore = require('@google-cloud/datastore');

module.exports.create = ( spec ) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        var model = spec.model,
            projectId = spec.projectId,
            middleware = spec.use;

        if( ! model ) {
            reject( new Error(".create: model must be defined"));
        }

        if( ! model.name ) {
            reject ( new Error(".create: model.name must be defined"));
        }

        if( ! projectId ) {
            reject( new Error(".create: projectId must be defined"));
        }

        model.fields = model.fields || {};

        const ds = datastore({
            projectId: projectId
        });

        // Automatically parse request body as JSON
        router.use(bodyParser.json());

        if(middleware) {
            router.use(middleware);
        }

        resolve({
            model: model,
            projectId: projectId,
            ds: ds,
            router: router
        });
    });
};