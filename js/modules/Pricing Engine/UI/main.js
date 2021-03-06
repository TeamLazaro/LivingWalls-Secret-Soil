
/*
 * -/-/-/-/-/-/-
 * 	~~~~~ SETUP AND INITIALIZATION
 * -/-/-/-/-/-/-
 */

// Register all the templates
$( function () {

	window.__UI = window.__UI || { };

	__UI.templates = { };
	$( ".js_template" ).each( function ( _i, domTemplate ) {
		var templateName = domTemplate.dataset.name;
		// Register as a template
		__UI.templates[ templateName ] = Handlebars.compile( domTemplate.innerText );
		// Register as a partial
		Handlebars.registerPartial( templateName, domTemplate.innerText );
	} );

	// Set template helpers
	for ( var helper in __UTIL.template ) {
		Handlebars.registerHelper( helper, __UTIL.template[ helper ] );
	}
	for ( var comparator in __UTIL.comparators ) {
		Handlebars.registerHelper( comparator, __UTIL.comparators[ comparator ] );
	}

} );

/*
 *
 * When the spreadsheet has been loaded,
 * 	Extract and plug in the relevant data on the UI.
 *
 */
$( document ).on( "spreadsheet/load", function ( event, workbook ) {

	// Plug in the page title
	if ( $( "html" ).data( "page" ) == "page-pricing-index" )
		document.title = __OMEGA.settings[ "Page Title" ] + " | " + document.title;
	else
		document.title = document.title + " | " + __OMEGA.settings[ "Page Title" ];
	// Plug in the page heading
	$( ".js_page_heading" ).text( __OMEGA.settings[ "Page Heading" ] );

	// The Text for the Default Filter Applied
	var termForUnit = __OMEGA.settings[ "Term for \"Unit\"" ];
	$( ".js_default_filter_text" ).text( "All available " + termForUnit + "s" );

	// The Text for Unit Search Field Placeholder
	$( ".js_search_query" ).attr( "placeholder", "Search by " + termForUnit + " number" );

	// Set the privacy disclaimers
	$( ".js_privacy_disclaimer" ).text( __OMEGA.settings[ "Privacy Disclaimer" ] );

	// Plonk in arbitrary markup in pre-designated spots
	$( "head" ).append( __OMEGA.settings[ "Before Closing Head Tag" ] );
	$( "body" ).prepend( __OMEGA.settings[ "After Opening Body Tag" ] );
	$( "body" ).append( __OMEGA.settings[ "Before Closing Body Tag" ] );

	// Set up all the sorting criteria
	var unitSortingMarkup = __UI.templates.unitSortingCriteria( {
		criteria: __OMEGA.unitSortingCriteria
	} );
	$( ".js_sort_by" ).html( unitSortingMarkup );

} );
