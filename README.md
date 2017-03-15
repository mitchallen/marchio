marchio
==
REST to database mapper 
--

<p align="left">
  <a href="https://travis-ci.org/mitchallen/marchio">
    <img src="https://img.shields.io/travis/mitchallen/marchio.svg?style=flat-square" alt="Continuous Integration">
  </a>
  <a href="https://codecov.io/gh/mitchallen/marchio">
    <img src="https://codecov.io/gh/mitchallen/marchio/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
  <a href="https://npmjs.org/package/marchio">
    <img src="http://img.shields.io/npm/dt/marchio.svg?style=flat-square" alt="Downloads">
  </a>
  <a href="https://npmjs.org/package/marchio">
    <img src="http://img.shields.io/npm/v/marchio.svg?style=flat-square" alt="Version">
  </a>
  <a href="https://npmjs.com/package/marchio">
    <img src="https://img.shields.io/github/license/mitchallen/marchio.svg" alt="License"></a>
  </a>
</p>

## Installation

```
$ npm init
$ npm install marchio --save
```
  
* * *

## Usage

### Google Datastore Demo

#### Prerequisite

To run the Google Datastore demo you will need a Google Cloud account.  Visit https://cloud.google.com for more info.

* * *

#### Environment Variables

Create an environment variable set to the value of a Google Cloud project id and another set to an HTTP port value:

```
$ export MARCHIO_GOOGLE_PROJECT_ID='my-project-id'
$ export MARCHIO_PORT=8080
```

You can make this permanent by setting it in <b>~/.bash\_profile</b> on a Mac or in Linux and then running <b>source ~/.bash_profile</b>.

The Google Cloud project must be enabled for Google Datastore.

* * *

#### Create and Run the Demo Project

Create a new folder called __datastore__.

At the command line execute the following (sans $):

```
$ npm init
$ npm install marchio --save
$ npm install marchio-datastore --save
```
    
Create a file called __index.js__ and paste in this code and save it:

```javascript
"use strict";
 
var factory = require("marchio"),
    datastore = require('marchio-datastore');
 
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
        put: true
    })
)
.then( (dsApp) => _marchio.use(dsApp) )
.then( () => _marchio.listen( PORT ) )
.catch( (err) => { 
    console.error(err); 
}); 
    
```

At the command line run:

```
$ node index.js
```
    
In a second terminal window run this command:

```
$ curl -i -X POST -H "Content-Type: application/json" -d '{"email":"test@demo.com"}' http://localhost:8080/user
```

The response will look like this (but with a different _id number):

```
{"email":"test@demo.com","status":"NEW","_id":"1234567890123456"}
```

Copy the <b>_id</b> number and paste it into a command like this (replacing <i>1234567890123456</i> with whatever was returned by the POST command):

```
$ curl -X GET -H "Accept: applications/json" http://localhost:8080/user/1234567890123456
```

In a browser visit https://console.cloud.google.com/datastore/ and verify that the entity has been added.

Paste the id into another command like this (replacing 1234567890123456 with whatever was returned by the POST command):

```$ curl -i -X PUT -H "Content-Type: application/json" -d '{"email":"test@demo.com", "status":"UPDATED"}' http://localhost:8080/user/1234567890123456```
    
Run the GET command again to see the change to the status value.

In a browser visit https://console.cloud.google.com/datastore/ and verify that the entity has been updated.

Try the POST command a few more times, changing the email address value each time.

* * *

## Modules

<dl>
<dt><a href="#module_marchio">marchio</a></dt>
<dd><p>Module</p>
</dd>
<dt><a href="#module_marchio-factory">marchio-factory</a></dt>
<dd><p>Factory module</p>
</dd>
</dl>

<a name="module_marchio"></a>

## marchio
Module


* [marchio](#module_marchio)
    * [.package()](#module_marchio+package)
    * [.health()](#module_marchio+health) ⇒ <code>Promise</code>
    * [.use(middleware)](#module_marchio+use) ⇒ <code>Promise</code>
    * [.listen(port)](#module_marchio+listen) ⇒ <code>Promise</code>
    * [.close()](#module_marchio+close) ⇒ <code>Promise</code>
    * [.kill()](#module_marchio+kill) ⇒ <code>Promise</code>

<a name="module_marchio+package"></a>

### marchio.package()
Returns the package name

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
<a name="module_marchio+health"></a>

### marchio.health() ⇒ <code>Promise</code>
Health check

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
**Example** *(Usage Example)*  
```js
"use strict";

var factory = require("marchio");

factory.create()
.then( (obj) => obj.health() )
.then( (result) => {
    console.log("HEALTH: ", result);
})
.catch( (err) => { 
    console.error(err); 
});
```
<a name="module_marchio+use"></a>

### marchio.use(middleware) ⇒ <code>Promise</code>
Use middleware function

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>middleware</code> | ExpressJS middleware function, app, or router |

**Example** *(Usage Example)*  
```js
// $ npm install --save marchio-datastore

"use strict";

var factory = require("marchio"),
    datastore = require('marchio-datastore');

var GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID;

var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" }
    }
};

var _marchio = null;

factory.create({})
.then( (obj) => _marchio = obj )
.then( () => 
    datastore.create({
        projectId: GOOGLE_PROJECT_ID,
        model: _testModel,
        post: true,
        get: true
    })
)
.then( (dsApp) => _marchio.use(dsApp) )
.catch( function(err) { 
    console.error(err); 
});
```
<a name="module_marchio+listen"></a>

### marchio.listen(port) ⇒ <code>Promise</code>
Listen function

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | Port to listen for HTTP requests |

**Example** *(Usage Example)*  
```js
// $ npm install --save marchio-datastore

"use strict";

var factory = require("marchio"),
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

factory.create({})
.then( (obj) => _marchio = obj )
.then( () => 
   datastore.create({
        projectId: GOOGLE_PROJECT_ID,
        model: _testModel,
        post: true,
        get: true
    })
)
.then( (dsApp) => _marchio.use(dsApp) )
.then( () => _marchio.listen( PORT ) )
.catch( function(err) { 
    console.error(err); 
});
```
<a name="module_marchio+close"></a>

### marchio.close() ⇒ <code>Promise</code>
Close function

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
**Example** *(Usage Example)*  
```js
_marchio.close()
    .then( () => _marchio.kill() )
    .catch( (err) => { 
        console.error(err.message);
    });
```
<a name="module_marchio+kill"></a>

### marchio.kill() ⇒ <code>Promise</code>
Kill function

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
**Example** *(Usage Example)*  
```js
_marchio.close()
    .then( () => _marchio.kill() )
    .catch( (err) => { 
        console.error(err.message);
   });
```
<a name="module_marchio-factory"></a>

## marchio-factory
Factory module

<a name="module_marchio-factory.create"></a>

### marchio-factory.create(spec) ⇒ <code>Promise</code>
Factory method 
It takes one spec parameter that must be an object with named parameters

**Kind**: static method of <code>[marchio-factory](#module_marchio-factory)</code>  
**Returns**: <code>Promise</code> - that resolves to {module:marchio}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | Named parameters object |
| [spec.verbose] | <code>boolean</code> | <code>false</code> | Echo debug message to the console |

**Example** *(Usage example)*  
```js

"use strict";

var factory = require("marchio");

factory.create({})
.then( (obj) => obj.health() )
.catch( (err) => { 
   console.error(err); 
});
```


* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/marchio.git](https://bitbucket.org/mitchallen/marchio.git)
* [github.com/mitchallen/marchio.git](https://github.com/mitchallen/marchio.git)

* * *

## Donations

In lieu of donations you can support this project by buying one of my books: http://amazon.com/author/mitch.allen

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.11

* Upgraded marchio-datastore version and example to now support HTTP PUT method

#### Version 0.1.10

* Upgraded marchio-datastore version
* Now must specify what HTTP method to enable in datastore.create method.

#### Version 0.1.9

* Fixed cut off code in doc example

#### Version 0.1.8

* Updated documentation

#### Version 0.1.7

* Checked in file updates

#### Version 0.1.6

* Added environment variable setup to doc, updated example dependencies

#### Version 0.1.5

* Cleaned up documentation

#### Version 0.1.4

* Added Google Datastore example, added usage documentation

#### Version 0.1.3

* Fixed main reference in package.json

#### Version 0.1.2

* Cleaned up doc
* .listen method now just takes port argument instead of param object

#### Version 0.1.1

* Added doc

#### Version 0.1.0 

* initial release

* * *
