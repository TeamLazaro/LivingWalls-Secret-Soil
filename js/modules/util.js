
__UTIL = { };

/*
 * functions based on native operations
 */
__UTIL.comparators = {
	"is equal to": function ( operand1, operand2 ) {
		return operand1 == operand2;
	},
	"is not equal to": function ( operand1, operand2 ) {
		return operand1 != operand2;
	},
	"is greater than to": function ( operand1, operand2 ) {
		return operand1 > operand2;
	},
	"is greater than or equal to": function ( operand1, operand2 ) {
		return operand1 >= operand2;
	},
	"is less than to": function ( operand1, operand2 ) {
		return operand1 < operand2;
	},
	"is less than or equal to": function ( operand1, operand2 ) {
		return operand1 <= operand2;
	},
	"is between": function ( value, lowerAndUpperLimit ) {
		var lowerLimit = lowerAndUpperLimit[ 0 ];
		var upperLimit = lowerAndUpperLimit[ 1 ];
		return ( value > lowerLimit ) && ( value < upperLimit );
	},
	"or": function ( operand1, operand2 ) {
		return operand1 || operand2;
	}
};
__UTIL.comparators[ "is" ] = __UTIL.comparators[ "is equal to" ];
__UTIL.comparators[ "=" ] = __UTIL.comparators[ "is equal to" ];
__UTIL.comparators[ "==" ] = __UTIL.comparators[ "is equal to" ];
// __UTIL.comparators[ "===" ] = __UTIL.comparators[ "is deep equal to" ];
__UTIL.comparators[ "is not" ] = __UTIL.comparators[ "is not equal to" ];
__UTIL.comparators[ "!=" ] = __UTIL.comparators[ "is not equal to" ];
__UTIL.comparators[ "<>" ] = __UTIL.comparators[ "is not equal to" ];
// __UTIL.comparators[ "!==" ] = __UTIL.comparators[ "is not deep equal to" ];
__UTIL.comparators[ ">" ] = __UTIL.comparators[ "is greater than to" ];
__UTIL.comparators[ ">=" ] = __UTIL.comparators[ "is greater than or equal to" ];
__UTIL.comparators[ "<" ] = __UTIL.comparators[ "is less than to" ];
__UTIL.comparators[ "<=" ] = __UTIL.comparators[ "is less than or equal to" ];



/*
 * Renders a template with data
 */
__UTIL.renderTemplate = function () {

	var d;
	function replaceWith ( m ) {

		var pipeline = m.slice( 2, -2 ).trim().split( / *\| */ );
		var value = d[ pipeline[ 0 ] ];
		for ( var _i = 1; _i < pipeline.length; _i +=1 ) {
			value = __UTIL.template[ pipeline[ _i ] ]( value );
		}

		return value;

	}

	return function renderTemplate ( template, data ) {
		d = data;
		return template.replace( /({{[^{}]+}})/g, replaceWith );
	}

}();

__UTIL.template = { };
__UTIL.template.getTemplateName = function getTemplateName () {
	return Array.prototype.slice.call( arguments, 0, arguments.length - 1 ).join( "" );
};
__UTIL.template.INF = indianNumberingFormat;
__UTIL.template.INR = formatNumberToIndianRupee;
// A template helper that gives the floor number in an ordinal word form
__UTIL.template.floorInOrdinalWord = function () {
	var floorToWords = [ "Ground", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh" ];
	return function floorInOrdinalWord ( floor ) {
		return floorToWords[ floor ] || "";
	}
}();
__UTIL.template.isMultipleOf = function isMultipleOf ( number, multipleOf ) {
	return number % multipleOf == 0;
};
__UTIL.template.hiddenIfNull = function hiddenIfNull ( thing ) {
	return thing ? "" : "hidden";
};

/*
 *
 * Group an list of elements by a specific attribute
 *
 * For example,
 * 	[ { n: 1, y: "a" }, { n: 5, y: "e" }, { n: 1, y: "la" }, { n: 6, y: "f" } ]
 * 	grouped by `n`, will be
 *	{
 * 		"1": [ { n: 1, y: "a" }, { n: 1, y: "la" } ],
 * 		"5": [ { n: 5, y: "e" } ],
 * 		"6": [ { n: 6, y: "f" } ]
 * 	}
 *
 */
__UTIL.groupListBy = function groupListBy ( list, by ) {
	var groupedObject = { };
	var _i;
	var listLength = list.length;
	var value;
	for ( _i = 0; _i < listLength; _i += 1 ) {
		value = list[ _i ][ by ]
		if ( ! ( value in groupedObject ) )
			groupedObject[ value ] = [ list[ _i ] ];
		else
			groupedObject[ value ] = groupedObject[ value ].concat( [ list[ _i ] ] );
	}
	return groupedObject;
};

/*
 *
 * Parse a number formatted as a string to valid JavaScript number
 *
 */
function parseStringToNumber ( value ) {

	// If the value is not a string, return it back
	if ( typeof value != "string" || value.trim() == "" )
		return value;

	// If the value contains any character other than a digit, comma or a decimal point, return it back
	if ( /[^\d\-\.,]/.test( value ) )
		return value;

	return parseFloat( value.replace( /,/g, "" ) );

}

/*
 *
 * Format a number to an Indian Rupee
 *
 */
function formatNumberToIndianRupee ( number, options ) {

	if ( ! number )
		return 0;

	options = options || { };
	var formattedNumber;

	number = parseStringToNumber( number );
	var roundedNumber = number.toFixed( 0 );
	var integerAndFractionalParts = ( roundedNumber + "" ).split( "." );
	var integerPart = integerAndFractionalParts[ 0 ];
	var fractionalPart = integerAndFractionalParts[ 1 ];

	var lastThreeDigitsOfIntegerPart = integerPart.slice( -3 );
	var allButLastThreeDigitsOfIntegerPart = integerPart.slice( 0, -3 );

	formattedNumber = allButLastThreeDigitsOfIntegerPart.replace( /\B(?=(\d{2})+(?!\d))/g, "," );

	if ( allButLastThreeDigitsOfIntegerPart ) {
		formattedNumber += ",";
	}
	formattedNumber += lastThreeDigitsOfIntegerPart;

	if ( fractionalPart ) {
		formattedNumber += "." + fractionalPart;
	}

	var symbol = options.symbol === false ? "" : "₹";
	if ( /^-/.test( formattedNumber ) ) {
		formattedNumber = formattedNumber.replace( /^-/, "minus " + symbol );
	}
	else {
		formattedNumber = symbol + formattedNumber;
	}

	return formattedNumber;

}



/*
 *
 * Format a number to the Indian Numbering format
 *
 */
function indianNumberingFormat ( number ) {

	if ( ! number )
		return 0;

	var formattedNumber;

	number = parseStringToNumber( number );
	var roundedNumber = number.toFixed( 0 );
	var integerAndFractionalParts = ( roundedNumber + "" ).split( "." );
	var integerPart = integerAndFractionalParts[ 0 ];
	var fractionalPart = integerAndFractionalParts[ 1 ];

	var lastThreeDigitsOfIntegerPart = integerPart.slice( -3 );
	var allButLastThreeDigitsOfIntegerPart = integerPart.slice( 0, -3 );

	formattedNumber = allButLastThreeDigitsOfIntegerPart.replace( /\B(?=(\d{2})+(?!\d))/g, "," );

	if ( allButLastThreeDigitsOfIntegerPart ) {
		formattedNumber += ",";
	}
	formattedNumber += lastThreeDigitsOfIntegerPart;

	if ( fractionalPart ) {
		formattedNumber += "." + fractionalPart;
	}

	if ( /^-/.test( formattedNumber ) ) {
		formattedNumber = formattedNumber.replace( /^-/, "minus " );
	}

	return formattedNumber;

}


/*
 *
 * Animate the count-down or count-up of a number in the INR format
 *
 */
function countToAmount ( $el, amount ) {

	// Cancel any animations that are already in progress for this element
	$el.stop( true );

	// We want to explicitly the starting point for the animation.
	// The is only needed for the first time an animation on an element is run.
	var currentAmount = $el.text().replace( /[^\d\.]/g, "" );
	$el.animate( { amount: currentAmount }, 0 ).stop( true, true );

	// Now, tween on!
	$el.animate( { amount: amount }, {
		duration: 999,
		progress: function () {
			$el.text( formatNumberToIndianRupee( this.amount ) );
		}
	} );

}

/*
 *
 *
 * Get the current time and date stamp
 *	in Indian Standard Time
 *
 *	reference
 *		https://stackoverflow.com/questions/22134726/get-ist-time-in-javascript
 *
 */
function getDateAndTimeStamp ( options ) {

	options = options || { };
	var ISTOffset = 330 * 60 * 1000;
	var dateObject = new Date( ( new Date() ).getTime() + ISTOffset );

	// Date components
		// Year
	var year = dateObject.getUTCFullYear();
		// Month
	var month = ( dateObject.getUTCMonth() + 1 );
	if ( month < 10 ) month = "0" + month;
		// Day
	var day = dateObject.getUTCDate();
	if ( day < 10 ) day = "0" + day;

	// Time components
		// Hours
	var hours = dateObject.getUTCHours();
	if ( hours < 10 ) hours = "0" + hours;
		// Minutes
	var minutes = dateObject.getUTCMinutes();
	if ( minutes < 10 ) minutes = "0" + minutes;
		// Seconds
	var seconds = dateObject.getUTCSeconds();
	if ( seconds < 10 ) seconds = "0" + seconds;
		// Milli-seconds
	var milliseconds = dateObject.getUTCMilliseconds();
	if ( milliseconds < 10 ) milliseconds = "00" + milliseconds;
	else if ( milliseconds < 100 ) milliseconds = "0" + milliseconds;

	// Assembling all the parts
	var datetimestamp = year
				+ "/" + month
				+ "/" + day

				+ " " + hours
				+ ":" + minutes
				+ ":" + seconds
				+ "." + milliseconds

	if ( options.separator )
		datetimestamp = datetimestamp.replace( /[\/:\.]/g, options.separator );

	return datetimestamp;

}

function slugify ( string, options ) {

	options = ( typeof options === "string" )
				? { replacement: options }
				: options || { }
	options.remove = options.remove || /[^\w\s$*_+~.()'"!\-:@]/g;

	// Not seeded at all
	var charMap = { };

	// var slug = string.split( "" )
					// .reduce( function ( result, ch ) {
					// 	return result
					// 		// allowed
					// 		+ ( charMap[ ch ] || ch ).replace( options.remove, "" )
					// }, "" )
	var slug = string
				// Map special to Latin ones
				.replace( /[^\w\s]/g, function ( match ) {
					return charMap[ match ] || match;
				} )
				// Remove certain specified characters
				.replace( options.remove, "" )
				// Trim leading and trailing spaces
				.replace( /^\s+|\s+$/g, "" )
				// Convert spaces to the specified separator
				.replace( /[-\s]+/g, options.replacement || "-" )
				// Remove trailing separators
				.replace( "#{replacement}$", "" )

	return slug.toLowerCase();

}
__UTIL.template.slugify = slugify;

/*
 * Returns the absolute value of a number, i.e. sans the "+" or "-"
 */
function getAbsoluteValueOfNumber ( number ) {
	return Math.abs( number );
}
__UTIL.template.getAbsoluteValueOfNumber = getAbsoluteValueOfNumber;

/*
 * Returns the sign of a number, i.e. either "+" or "-"
 */
function getSignOfNumber ( number ) {
	return number >= 0 ? "+" : "-";
}
__UTIL.template.getSignOfNumber = getSignOfNumber;

/*
 *
 * This opens a new page in an iframe and closes it once it has loaded
 *
 */
function openPageInIframe ( url, name, options ) {

	options = options || { };
	var closeOnLoad = options.closeOnLoad || false;

	var $iframe = $( "<iframe>" );
	$iframe.attr( {
		width: 0,
		height: 0,
		title: name,
		src: url,
		style: "display:none;",
		class: "js_iframe_trac"
	} );

	$( "body" ).append( $iframe );

	if ( closeOnLoad ) {
		$( window ).one( "message", function ( event ) {
			if ( location.origin != event.originalEvent.origin )
				return;
			var message = event.originalEvent.data;
			if ( message.status == "ready" )
				setTimeout( function () { $iframe.remove() }, 27 * 1000 );
		} );
	}
	else {
		return $iframe.get( 0 );
	}

}

function waitFor ( seconds ) {

	return new Promise( function ( resolve, reject ) {
		setTimeout( function () {
			resolve();
		}, seconds * 1000 );
	} );

}
