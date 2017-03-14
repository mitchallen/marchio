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
    * [.health()](#module_marchio+health)
    * [.use()](#module_marchio+use)

<a name="module_marchio+package"></a>

### marchio.package()
Returns the package name

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
<a name="module_marchio+health"></a>

### marchio.health()
Health check

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
**Example** *(Usage Example)*  
```js
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
```
<a name="module_marchio+use"></a>

### marchio.use()
Use middleware function

**Kind**: instance method of <code>[marchio](#module_marchio)</code>  
**Example** *(Usage Example)*  
```js
                var factory = require("marchio");

                var GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID;

                var _marchio = null;
             
                factory.create({})
                .then(function(obj) {
                    _marchio = obj;
                    return datastore.create({
                        projectId: GOOGLE_PROJECT_ID,
                        model: _testModel
                    });
                })
                .then(function(result) {
                    console.log("HEALTH: ", result);
                })
                .catch( function(err) { 
                    console.error(err); 
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

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Named parameters object |

**Example** *(Usage example)*  
```js
    var factory = require("marchio");
 
    factory.create({})
    .then( (obj) => {
        obj.health();
    })
    .catch( function(err) { 
        console.error(err); 
    });
```
