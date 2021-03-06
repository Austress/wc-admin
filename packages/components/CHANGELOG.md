# 1.5.0 (unreleased)
- Chart component: remove d3-array dependency.
- Chart component: fix display when there is no data.
- Improves display of charts where all values are 0.
- Fix X-axis labels in hourly bar charts.
- New `<Search>` prop named `showClearButton`, that will display a 'Clear' button when the search box contains one or more tags.
- Number of selectable chart elements is now limited to 5.
- Color scale logic for charts with lots of items has been fixed.
- Update `@woocommerce/navigation` to v2.0.0
- Bug fix for `<StockReportTable />` returning N/A instead of zero.

# 1.4.2
- Add emoji-flags dependency

# 1.4.1
- Chart component: format numbers and prices using store currency settings.
- Make `href`/linking optional in SummaryNumber.
- Fix SummaryNumber example code.

# 1.4.0
- Add download log ip address autocompleter to search component
- Add order number autocompleter to search component
- Add order number, username, and IP address filters to the downloads report.
- Added `interactive` prop for `d3chart/legend` to signal if legend items are clickable or not.
- Fix for undefined ref in `d3chart/legend`.
- Added three news props to `<Chart>`:
  - `interactiveLegend`: whether legend items are clickable or not. Defaults to true.
  - `legendPosition`: can be `top`, `side` or `bottom`. If not specified, it's calculated based on `mode` and viewport width.
  - `showHeaderControls`: whether the header controls must be visible. Defaults to true.
- `getColor()` method in chart utils now requires `keys` and `colorScheme` to be passed as separate params.
- Fix to avoid duplicated Y-axis ticks when the Y max value was 0.
- Remove decimals from Y-axis when displaying currencies.
- Fix date formatting on charts in Safari.

# 1.3.0

- Update `<Table />` to use header keys to denote which columns are shown
- Add `onColumnsChange` property to `<Table />` which is called when columns are shown/hidden
- Add country autocompleter to search component
- Add customer email autocompleter to search component
- Add customer username autocompleter to search component
- Adding new `<Chart />` component.
- Added new `showDatePicker` prop to `<Filters />` component which allows to use the filters component without the date picker.
- Added new taxes and customers autocompleters, and added support for using them within `<Filters />`.
- Bug fix for `<SummaryNumber />` returning N/A instead of zero.
- Bug fix for screen reader label IDs in `<Table />` header.
- Added new component `<TextControlWithAffixes />`.

# 1.2.0

- Update `Search` to exclude already-selected items
- Fix incorrectly loaded `proptype-validator`
- Update focus style on `SummaryNumber`
- Remove prefixes from order statuses

# 1.1.0

- Add `interpolate-components` as an explicit dependency, fixes issue with
- Update `<Popover />` usage to match core component updates
- Chart component: Add `chartMode` prop to control display mode
- Add Taxes autocompleter to Search
- Improve test coverage with new tests
