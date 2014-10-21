
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Event emitter:
	EventEmitter = require( 'events' ).EventEmitter,

	// Module to be tested:
	responseTime = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'connect-middleware-response-time', function tests() {
	'use strict';

	// SETUP //

	var request, response;

	beforeEach( function() {
		response = new EventEmitter();
	});


	// TESTS //

	it( 'should export a function', function test() {
		expect( responseTime ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided something other than a function', function test() {
		var values = [
				5,
				'5',
				true,
				null,
				undefined,
				NaN,
				{},
				[]
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				responseTime( value );
			};
		}
	});

	it( 'should return a function', function test() {
		expect( responseTime( function(){} ) ).to.be.a( 'function' );
	});

	it( 'should have an arity of 3', function test() {
		assert.strictEqual( responseTime( function(){} ).length, 3 );
	});

	it( 'should invoke the provided callback and return the response time', function test() {
		var foo = responseTime( bar );
		foo( request, response, next );
		function bar( value ) {
			if ( arguments.length !== 1 ) {
				assert.notOk( true );
			}
			expect( value ).to.be.a( 'number' );
		}
		function next() {
			response.emit( 'finish' );
		}
	});

	it( 'should invoke the provided callback and return NaN if the response closes unexpectedly', function test() {
		var foo = responseTime( bar );
		foo( request, response, next );
		function bar( value ) {
			if ( arguments.length !== 1 ) {
				assert.notOk( true );
			}
			expect( value ).to.be.a( 'number' );
			assert.ok( value !== value );
		}
		function next() {
			response.emit( 'close' );
		}
	});

	it( 'should remove listeners', function test() {
		var foo = responseTime( bar ),
			counter = 0;
		foo( request, response, next );
		function bar( value ) {
			if ( arguments.length !== 1 ) {
				assert.notOk( true );
			}
			expect( value ).to.be.a( 'number' );
			if ( ++counter === 1 ) {
				assert.ok( true );
			} else {
				assert.notOk( true );
			}
		}
		function next() {
			response.emit( 'finish' );
			response.emit( 'close' );
			response.emit( 'finish' );
		}
	});

});