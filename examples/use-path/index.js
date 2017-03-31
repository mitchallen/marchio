/**
    Example: use-path
    Author: Mitch Allen (http://mitchallen.com)
 */

/*
    To test:

    Set this environment variable to your Google Cloud project id:

    export MARCHIO_GOOGLE_PROJECT_ID='my-project-id'

    In a terminal window run this command:

    $ node index.js

    In a second terminal window run this command:

    $ curl -i -X POST -H "Content-Type: application/json" -d '{"email":"test@demo.com"}' http://localhost:8080/api/user

    The response will look like this (but with a different _id number):

    {"email":"test@demo.com","status":"NEW","_id":"1234567890123456"}

    Copy the id number and paste it into a command like this (replacing 1234567890123456 with whatever was returned by the POST command):

    $ curl -X GET -H "Accept: applications/json" http://localhost:8080/api/user/1234567890123456

    In a browser visit https://console.cloud.google.com/datastore/ and verify that Entity has been added.

    Paste the id into another command like this (replacing 1234567890123456 with whatever was returned by the POST command):

    $ curl -i -X PUT -H "Content-Type: application/json" -d '{"email":"test@demo.com", "status":"UPDATED"}' http://localhost:8080/api/user/1234567890123456

    Run the GET command again to see the change to the status value.

    In a browser visit https://console.cloud.google.com/datastore/ and verify that Entity has been updated.

    To patch the entity do the following (changing the URL id)

    $ curl -i -X PATCH -H "Content-Type: application/json" -d '[{"op":"replace","path":"/status","value":"PATCH THE STATUS"}]' http://localhost:8080/api/user/1234567890123456

    Paste the id into the command below (replacing 123 ...) to delete the entity

    curl -i -X DELETE -H "Content-Type: application/json" http://localhost:8080/api/user/1234567890123456

    Visit the console again to verify that the entity has been deleted

    Try the POST command a few more times, changing the email address each time.

 */

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";
 
var factory = require("marchio"),
// var factory = require("../../modules/index"),
    datastore = require('marchio-datastore');
 
const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;
 
var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" }
    }
};
 
var _marchio = null;
 
factory.create({
    verbose: true
})
.then( (obj) => _marchio = obj )
.then( () => 
   datastore.create({
        projectId: GOOGLE_PROJECT_ID,
        model: _testModel,
        post: true,
        get: true,
        put: true,
        del: true,
        patch: true
    })
)
.then( (dsApp) => _marchio.use( '/api', dsApp ) )
.then( () => _marchio.listen( PORT ) )
.catch( (err) => { 
    console.error(err); 
});
