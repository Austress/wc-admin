/** @format */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import PropTypes from 'prop-types';

/**
 * WooCommerce dependencies
 */
import { getDateParamsFromQuery } from '@woocommerce/date';
import { getNewPath } from '@woocommerce/navigation';
import { SummaryList, SummaryListPlaceholder, SummaryNumber } from '@woocommerce/components';
import { calculateDelta, formatValue } from '@woocommerce/number';
import { formatCurrency } from '@woocommerce/currency';

/**
 * Internal dependencies
 */
import { getSummaryNumbers } from 'wc-api/reports/utils';
import ReportError from 'analytics/components/report-error';
import withSelect from 'wc-api/with-select';

/**
 * Component to render summary numbers in reports.
 */
export class ReportSummary extends Component {
	formatVal( val, type ) {
		return 'currency' === type ? formatCurrency( val ) : formatValue( type, val );
	}

	getValues( key, type ) {
		const { emptySearchResults, summaryData } = this.props;
		const { totals } = summaryData;

		const primaryValue = emptySearchResults ? 0 : totals.primary[ key ];
		const secondaryValue = emptySearchResults ? 0 : totals.secondary[ key ];

		return {
			delta: calculateDelta( primaryValue, secondaryValue ),
			prevValue: this.formatVal( secondaryValue, type ),
			value: this.formatVal( primaryValue, type ),
		};
	}

	render() {
		const { charts, query, selectedChart, summaryData } = this.props;
		const { isError, isRequesting } = summaryData;

		if ( isError ) {
			return <ReportError isError />;
		}

		if ( isRequesting ) {
			return <SummaryListPlaceholder numberOfItems={ charts.length } />;
		}

		const { compare } = getDateParamsFromQuery( query );

		const renderSummaryNumbers = ( { onToggle } ) =>
			charts.map( chart => {
				const { key, label, type } = chart;
				const href = getNewPath( { chart: key } );
				const isSelected = selectedChart.key === key;
				const { delta, prevValue, value } = this.getValues( key, type );

				return (
					<SummaryNumber
						key={ key }
						delta={ delta }
						href={ href }
						label={ label }
						prevLabel={
							'previous_period' === compare
								? __( 'Previous Period:', 'wc-admin' )
								: __( 'Previous Year:', 'wc-admin' )
						}
						prevValue={ prevValue }
						selected={ isSelected }
						value={ value }
						onLinkClickCallback={ onToggle }
					/>
				);
			} );

		return <SummaryList>{ renderSummaryNumbers }</SummaryList>;
	}
}

ReportSummary.propTypes = {
	/**
	 * Properties of all the charts available for that report.
	 */
	charts: PropTypes.array.isRequired,
	/**
	 * The endpoint to use in API calls to populate the Summary Numbers.
	 * For example, if `taxes` is provided, data will be fetched from the report
	 * `taxes` endpoint (ie: `/wc/v4/reports/taxes/stats`). If the provided endpoint
	 * doesn't exist, an error will be shown to the user with `ReportError`.
	 */
	endpoint: PropTypes.string.isRequired,
	/**
	 * The query string represented in object form.
	 */
	query: PropTypes.object.isRequired,
	/**
	 * Properties of the selected chart.
	 */
	selectedChart: PropTypes.shape( {
		/**
		 * Key of the selected chart.
		 */
		key: PropTypes.string.isRequired,
	} ).isRequired,
	/**
	 * Data to display in the SummaryNumbers.
	 */
	summaryData: PropTypes.object,
};

ReportSummary.defaultProps = {
	summaryData: {
		totals: {
			primary: {},
			secondary: {},
		},
		isError: false,
		isRequesting: false,
	},
};

export default compose(
	withSelect( ( select, props ) => {
		const { query, endpoint } = props;
		if ( query.search && ! ( query[ endpoint ] && query[ endpoint ].length ) ) {
			return {
				emptySearchResults: true,
			};
		}
		const summaryData = getSummaryNumbers( endpoint, query, select );

		return {
			summaryData,
		};
	} )
)( ReportSummary );
