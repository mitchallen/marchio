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
