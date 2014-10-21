/**
*
*	MIDDLEWARE: response time
*
*
*	DESCRIPTION:
*		- Connect middleware to calculate response times.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com.
*
*/

(function() {
	'use strict';

	// RESPONSE TIME //

	/**
	* FUNCTION: responseTime( clbk )
	*	Returns middleware to calculate response times.
	*
	* @param Function} clbk - callback invoked after calculating a response time
	* @returns {Function} middleware to calculate response times
	*/
	function responseTime( clbk ) {
		if ( typeof clbk !== 'function' ) {
			throw new TypeError( 'responseTime()::invalid input argument. Must provide a function.' );
		}
		/**
		* FUNCTION: middleware( request, response, next )
		*	Middleware to calculate response times. Note: if a response unexpectedly closes, the response time is `NaN`.
		*
		* @param {Object} request - HTTP request object
		* @param {Object} response - HTTP response object
		* @param {Function} next - callback to invoke after calculating a response time
		*/
		return function middleware( request, response, next ) {
			var start = process.hrtime();
			response.on( 'finish', compute );
			response.on( 'close', cancel );
			next();

			/**
			* FUNCTION: compute()
			*	Computes the response time.
			*/
			function compute() {
				var diff;
				removeListeners();
				diff = process.hrtime( start );
				clbk( diff[ 0 ]*1000 + diff[ 1 ]*1e-6 );
			} // end FUNCTION compute()

			/**
			* FUNCTION: cancel()
			*	Returns a NaN, as the response unexpectedly closed.
			*/
			function cancel() {
				removeListeners();
				clbk( NaN );
			} // end FUNCTION cancel()

			/**
			* FUNCTION: removeListeners()
			*	Removes response listeners.
			*/
			function removeListeners() {
				response.removeListener( 'finish', compute );
				response.removeListener( 'close', cancel );
			} // end FUNCTION removeListeners()
		}; // end FUNCTION middleware()
	} // end FUNCTION responseTime()


	// EXPORTS //

	module.exports = responseTime;

})();