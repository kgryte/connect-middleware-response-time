Response Time
=============
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Connect middleware to calculate response times.

Similar to [response-time](https://github.com/expressjs/response-time), except this implementation does not set a response header for the calculated time and does not override the default `response.writeHead` method.

The calculated response time is output to a `callback` provided on initialization. Accordingly, the module is better suited for logging response times and monitoring application performance.


## Installation

``` bash
$ npm install connect-middleware-response-time
```

## Usage

To use the module,

``` javascript
var responseTime = require( 'connect-middleware-response-time' );
```

#### responseTime( clbk )

The middleware generator accepts a `callback` which should accept a `numeric` value as its only input. 

``` javascript
var mw = responseTime( onTime );

function onTime( value ) {
	console.log( 'Response time: %s ms', value );
}
```

## Notes

In the event that an HTTP response terminates [prematurely](http://nodejs.org/api/http.html#http_event_close_1), the returned response time is `NaN`.


## Examples

``` javascript
var express = require( 'express' ),
	request = require( 'request' ),
	responseTime = require( 'connect-middleware-response-time' );

// Define a port:
var PORT = 7331;

// Create a new application:
var app = express();

// Use the response time middleware for all requests:
app.use( responseTime( logger ) );

// Bind a route:
app.get( '/', [ compute, send ] );

// Spin up a new server:
var server = app.listen( PORT, onListen );


function onListen() {
	request({
		'method': 'GET',
		'uri': 'http://127.0.0.1:' + PORT
	}, onResponse );
}

function onResponse( error, response, body ) {
	if ( error ) {
		throw new Error( error );
	}
	console.log( body );
}

function compute( request, response, next ) {
	var rand = Math.floor( Math.random()*2e6 ),
		idx = 0,
		x;
	for ( var i = 0; i < rand; i++ ) {
		x = Math.sqrt( ++idx );	
	}
	next();
}

function logger( value ) {
	console.log( 'Response time: %s ms', value );
}

function send( request, response, next ) {
	response
		.status( 200 )
		.send( '...computation finished...' );
}
```

To run an example from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```



## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/connect-middleware-response-time.svg
[npm-url]: https://npmjs.org/package/connect-middleware-response-time

[travis-image]: http://img.shields.io/travis/kgryte/connect-middleware-response-time/master.svg
[travis-url]: https://travis-ci.org/kgryte/connect-middleware-response-time

[coveralls-image]: https://img.shields.io/coveralls/kgryte/connect-middleware-response-time/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/connect-middleware-response-time?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/connect-middleware-response-time.svg
[dependencies-url]: https://david-dm.org/kgryte/connect-middleware-response-time

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/connect-middleware-response-time.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/connect-middleware-response-time

[github-issues-image]: http://img.shields.io/github/issues/kgryte/connect-middleware-response-time.svg
[github-issues-url]: https://github.com/kgryte/connect-middleware-response-time/issues