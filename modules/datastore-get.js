/**
    Module: datastore-get.js
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

        var getDB = function(req, res, next) {

            var eMsg = '';

            if( req.params.model !== model.name ) {
                eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
                console.error(eMsg);
                res
                    .status(404)
                    .json({ error: eMsg });
                return;
            }

            var _id = parseInt(req.params.id, 10);

            const query = ds.createQuery( model.name )
                .filter('__key__', '=', ds.key([ model.name, _id]));

            ds.runQuery(query)
            .then((results) => {

                // console.log(results);

                const records = results[0];

                var list = [];

                records.forEach((record) => {
                    const recordKey = record[ds.KEY];
                    console.log(recordKey.id, record );
                    // TODO - add back in id
                    list.push(record);
                });

                // TODO - what if not found???
                var response = list[0];
                response._id = _id;

                res
                    .location("/" + [ model.name, _id ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json(response);

            }).catch( function(err) { 
                console.error(err); 
                if(err) {
                    res
                        .status(500)
                        .json(err);
                } 
            });

        };

        // Automatically parse request body as JSON
        router.use(bodyParser.json());

        if(middleware) {
            router.use(middleware);
        }
        
        router.get( '/:model/:id', getDB );

        resolve(router);
    });
};