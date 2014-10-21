var express = require( 'express' ),
	request = require( 'request' ),
	responseTime = require( './../lib' );

// Define a port:
var PORT = 7331;

// Create a new application:
var app = express();

// Use the response time middleware for all requests:
app.use( responseTime( logger ) );

// Bind routes:
app.get( '/1', [ compute1, send ] );
app.get( '/2', [ compute2, send ] );

// Spin up a new server:
var server = app.listen( PORT, onListen );

// Initialize a request counter:
var total = 10,
	counter = 0;


function onListen() {
	var options = {};
	for ( var i = 0; i < total; i++ ) {
		options = {
			'method': 'GET',
			'uri': 'http://127.0.0.1:' + PORT
		};
		if ( i%2 === 0 ) {
			options.uri += '/1';
		} else {
			options.uri += '/2';
		}
		request( options, onResponse );
	}
}

function onResponse( error, response, body ) {
	if ( error ) {
		throw new Error( error );
	}
	if ( ++counter === total ) {
		server.close();
	}
}

function compute1( request, response, next ) {
	var rand = Math.floor( Math.random()*2e6 ),
		idx = 0,
		x;
	for ( var i = 0; i < rand; i++ ) {
		x = Math.sqrt( ++idx );
	}
	next();
}

function compute2( request, response, next ) {
	var rand = Math.floor( Math.random()*2e6 ),
		idx = 0,
		x;
	for ( var i = 0; i < rand; i++ ) {
		x = Math.random() * Math.sqrt( ++idx );
		x = Math.exp( x );
		x = x / 243 + 782.1973;
		x = Math.log( x );
		x = Math.pow( x, 4.974 );
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