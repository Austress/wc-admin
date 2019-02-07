/** @format */

/**
 * External dependencies
 */

export const updateEmptyNotice = ( { isEmpty, emptyMessage } ) => {
	if ( isEmpty && emptyMessage ) {
		console.log( 'showMessage', emptyMessage );
	} else {
		console.log( 'hideMessage', emptyMessage );
	}
};
