/** @format */
/**
 * External dependencies
 */
import { isEmpty, pick, uniq } from 'lodash';
import { parse, stringify } from 'qs';

/**
 * Internal dependencies
 */
import { getHistory } from './history';

// Expose history so all uses get the same history object.
export { getHistory };

// Export all filter utilities
export * from './filters';

/**
 * Internal dependencies
 */
// Import the module into itself. Functions consumed from this import can be mocked in tests.
import * as navUtils from './index';

/**
 * Returns a string with the site's wp-admin URL appended. JS version of `admin_url`.
 *
 * @param {String} path Relative path.
 * @return {String} Full admin URL.
 */
export const getAdminLink = path => wcSettings.adminUrl + path;

/**
 * Get the current path from history.
 *
 * @return {String}  Current path.
 */
export const getPath = () => getHistory().location.pathname;

/**
 * Converts a query object to a query string.
 *
 * @param {Object} query parameters to be converted.
 * @return {String} Query string.
 */
export const stringifyQuery = query => ( isEmpty( query ) ? '' : '?' + stringify( query ) );

/**
 * Gets query parameters that should persist between screens or updates
 * to reports, such as filtering.
 *
 * @param {Object} query Query containing the parameters.
 * @return {Object} Object containing the persisted queries.
 */
export const getPersistedQuery = ( query = navUtils.getQuery() ) =>
	pick( query, [ 'period', 'compare', 'before', 'after', 'interval', 'type' ] );

/**
 * Get an array of IDs from a comma-separated query parameter.
 *
 * @param {string} queryString string value extracted from URL.
 * @return {Array} List of IDs converted to numbers.
 */
export function getIdsFromQuery( queryString = '' ) {
	return uniq(
		queryString
			.split( ',' )
			.map( id => parseInt( id, 10 ) )
			.filter( Boolean )
	);
}

/**
 * Return a URL with set query parameters.
 *
 * @param {Object} query object of params to be updated.
 * @param {String} path Relative path (defaults to current path).
 * @param {Object} currentQuery object of current query params (defaults to current querystring).
 * @return {String}  Updated URL merging query params into existing params.
 */
export function getNewPath( query, path = getPath(), currentQuery = getQuery() ) {
	const queryString = stringifyQuery( { ...currentQuery, ...query } );
	return `${ path }${ queryString }`;
}

/**
 * Get the current query string, parsed into an object, from history.
 *
 * @return {Object}  Current query object, defaults to empty object.
 */
export function getQuery() {
	const search = getHistory().location.search;
	if ( search.length ) {
		return parse( search.substring( 1 ) ) || {};
	}
	return {};
}

/**
 * This function returns an event handler for the given `param`
 *
 * @param {string} param The parameter in the querystring which should be updated (ex `page`, `per_page`)
 * @param {string} path Relative path (defaults to current path).
 * @param {string} query object of current query params (defaults to current querystring).
 * @return {function} A callback which will update `param` to the passed value when called.
 */
export function onQueryChange( param, path = getPath(), query = getQuery() ) {
	switch ( param ) {
		case 'sort':
			return ( key, dir ) => updateQueryString( { orderby: key, order: dir }, path, query );
		case 'compare':
			return ( key, queryParam, ids ) =>
				updateQueryString( { [ queryParam ]: `compare-${ key }`, [ key ]: ids }, path, query );
		default:
			return value => updateQueryString( { [ param ]: value }, path, query );
	}
}

/**
 * Updates the query parameters of the current page.
 *
 * @param {Object} query object of params to be updated.
 * @param {String} path Relative path (defaults to current path).
 * @param {Object} currentQuery object of current query params (defaults to current querystring).
 */
export function updateQueryString( query, path = getPath(), currentQuery = getQuery() ) {
	const newPath = getNewPath( query, path, currentQuery );
	getHistory().push( newPath );
}
