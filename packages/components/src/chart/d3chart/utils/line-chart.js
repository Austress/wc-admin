/** @format */

/**
 * External dependencies
 */
import { event as d3Event, select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import moment from 'moment';

/**
 * Internal dependencies
 */
import { getColor } from './color';
import { calculateTooltipPosition, hideTooltip, showTooltip } from './tooltip';
import { smallBreak, wideBreak } from './breakpoints';

const handleMouseOverLineChart = ( date, parentNode, node, data, params, position, formats, tooltipParams ) => {
	d3Select( parentNode )
		.select( '.focus-grid' )
		.attr( 'opacity', '1' );
	showTooltip( params, data.find( e => e.date === date ), position, formats, tooltipParams );
};

/**
 * Describes getLine
 * @param {function} xLineScale - from `getXLineScale`.
 * @param {function} yScale - from `getYScale`.
 * @returns {function} the D3 line function for plotting all category values
 */
export const getLine = ( xLineScale, yScale ) =>
	d3Line()
		.x( d => xLineScale( moment( d.date ).toDate() ) )
		.y( d => yScale( d.value ) );

export const drawLines = ( node, data, params, layout, scales, formats, tooltipParams, xOffset ) => {
	const line = getLine( scales.xLineScale, scales.yScale );
	const series = node
		.append( 'g' )
		.attr( 'class', 'lines' )
		.selectAll( '.line-g' )
		.data( params.lineData.filter( d => d.visible ).reverse() )
		.enter()
		.append( 'g' )
		.attr( 'class', 'line-g' )
		.attr( 'role', 'region' )
		.attr( 'aria-label', d => d.key );

	let lineStroke = layout.width <= wideBreak || params.uniqueDates.length > 50 ? 2 : 3;
	lineStroke = layout.width <= smallBreak ? 1.25 : lineStroke;
	const dotRadius = layout.width <= wideBreak ? 4 : 6;

	params.uniqueDates.length > 1 &&
		series
			.append( 'path' )
			.attr( 'fill', 'none' )
			.attr( 'stroke-width', lineStroke )
			.attr( 'stroke-linejoin', 'round' )
			.attr( 'stroke-linecap', 'round' )
			.attr( 'stroke', d => getColor( d.key, params.orderedKeys, params.colorScheme ) )
			.style( 'opacity', d => {
				const opacity = d.focus ? 1 : 0.1;
				return d.visible ? opacity : 0;
			} )
			.attr( 'd', d => line( d.values ) );

	const minDataPointSpacing = 36;

	layout.width / params.uniqueDates.length > minDataPointSpacing &&
		series
			.selectAll( 'circle' )
			.data( ( d, i ) => d.values.map( row => ( { ...row, i, visible: d.visible, key: d.key } ) ) )
			.enter()
			.append( 'circle' )
			.attr( 'r', dotRadius )
			.attr( 'fill', d => getColor( d.key, params.orderedKeys, params.colorScheme ) )
			.attr( 'stroke', '#fff' )
			.attr( 'stroke-width', lineStroke + 1 )
			.style( 'opacity', d => {
				const opacity = d.focus ? 1 : 0.1;
				return d.visible ? opacity : 0;
			} )
			.attr( 'cx', d => scales.xLineScale( moment( d.date ).toDate() ) + xOffset )
			.attr( 'cy', d => scales.yScale( d.value ) )
			.attr( 'tabindex', '0' )
			.attr( 'aria-label', d => {
				const label = d.label
					? d.label
					: formats.tooltipLabelFormat( d.date instanceof Date ? d.date : moment( d.date ).toDate() );
				return `${ label } ${ formats.tooltipValueFormat( d.value ) }`;
			} )
			.on( 'focus', ( d, i, nodes ) => {
				const position = calculateTooltipPosition(
					d3Event.target,
					node.node(),
					tooltipParams.tooltipPosition
				);
				handleMouseOverLineChart( d.date, nodes[ i ].parentNode, node, data, params, position, formats, tooltipParams );
			} )
			.on( 'blur', ( d, i, nodes ) => hideTooltip( nodes[ i ].parentNode, tooltipParams.tooltip ) );

	const focus = node
		.append( 'g' )
		.attr( 'class', 'focusspaces' )
		.selectAll( '.focus' )
		.data( params.dateSpaces )
		.enter()
		.append( 'g' )
		.attr( 'class', 'focus' );

	const focusGrid = focus
		.append( 'g' )
		.attr( 'class', 'focus-grid' )
		.attr( 'opacity', '0' );

	focusGrid
		.append( 'line' )
		.attr( 'x1', d => scales.xLineScale( moment( d.date ).toDate() ) + xOffset )
		.attr( 'y1', 0 )
		.attr( 'x2', d => scales.xLineScale( moment( d.date ).toDate() ) + xOffset )
		.attr( 'y2', layout.height );

	focusGrid
		.selectAll( 'circle' )
		.data( d => d.values.reverse() )
		.enter()
		.append( 'circle' )
		.attr( 'r', dotRadius + 2 )
		.attr( 'fill', d => getColor( d.key, params.orderedKeys, params.colorScheme ) )
		.attr( 'stroke', '#fff' )
		.attr( 'stroke-width', lineStroke + 2 )
		.attr( 'cx', d => scales.xLineScale( moment( d.date ).toDate() ) + xOffset )
		.attr( 'cy', d => scales.yScale( d.value ) );

	focus
		.append( 'rect' )
		.attr( 'class', 'focus-g' )
		.attr( 'x', d => d.start )
		.attr( 'y', 0 )
		.attr( 'width', d => d.width )
		.attr( 'height', layout.height )
		.attr( 'opacity', 0 )
		.on( 'mouseover', ( d, i, nodes ) => {
			const isTooltipLeftAligned = ( i === 0 || i === params.dateSpaces.length - 1 ) && params.uniqueDates.length > 1;
			const elementWidthRatio = isTooltipLeftAligned ? 0 : 0.5;
			const position = calculateTooltipPosition(
				d3Event.target,
				node.node(),
				tooltipParams.tooltipPosition,
				elementWidthRatio
			);
			handleMouseOverLineChart( d.date, nodes[ i ].parentNode, node, data, params, position, formats, tooltipParams );
		} )
		.on( 'mouseout', ( d, i, nodes ) => hideTooltip( nodes[ i ].parentNode, tooltipParams.tooltip ) );
};
