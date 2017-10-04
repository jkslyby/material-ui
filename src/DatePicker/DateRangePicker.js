import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {dateTimeFormat, formatIso, isEqualDate} from './dateUtils';
import DateRangePickerDialog from './DateRangePickerDialog';
import TextField from '../TextField';

class DateRangePicker extends Component {
  static propTypes = {
    /**
     * Constructor for date formatting for the specified `locale`.
     * The constructor must follow this specification: ECMAScript Internationalization API 1.0 (ECMA-402).
     * `Intl.DateTimeFormat` is supported by most modern browsers, see http://caniuse.com/#search=intl,
     * otherwise https://github.com/andyearnshaw/Intl.js is a good polyfill.
     *
     * By default, a built-in `DateTimeFormat` is used which supports the 'en-US' `locale`.
     */
    DateTimeFormat: PropTypes.func,
    /**
     * If true, automatically accept and close the picker on select a date.
     */
    autoOk: PropTypes.bool,
    /**
     * Override the default text of the 'Cancel' button.
     */
    cancelLabel: PropTypes.node,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * Used to control how the Date Picker will be displayed when the input field is focused.
     * `dialog` (default) displays the DatePicker as a dialog with a modal.
     * `inline` displays the DatePicker below the input field (similar to auto complete).
     */
    container: PropTypes.oneOf(['dialog', 'inline']),
    /**
     * This is the initial end-date value of the component.
     * If either `value` or `valueLink` is provided they will override this
     * prop with `value` taking precedence.
     */
    defaultEndDate: PropTypes.object,
    /**
     * This is the initial start-date value of the component.
     * If either `value` or `valueLink` is provided they will override this
     * prop with `value` taking precedence.
     */
    defaultStartDate: PropTypes.object,
    /**
     * Override the inline-styles of DatePickerDialog's Container element.
     */
    dialogContainerStyle: PropTypes.object,
    /**
     * Disables the DatePicker.
     */
    disabled: PropTypes.bool,
    /**
     * Used to change the first day of week. It varies from
     * Saturday to Monday between different locales.
     * The allowed range is 0 (Sunday) to 6 (Saturday).
     * The default is `1`, Monday, as per ISO 8601.
     */
    firstDayOfWeek: PropTypes.number,
    /**
     * This function is called to format the date displayed in the input field, and should return a string.
     * By default if no `locale` and `DateTimeFormat` is provided date objects are formatted to ISO 8601 YYYY-MM-DD.
     *
     * @param {object} date Date object to be formatted.
     * @returns {any} The formatted date.
     */
    formatDate: PropTypes.func,
    /**
     * Locale used for formatting the `DatePicker` date strings. Other than for 'en-US', you
     * must provide a `DateTimeFormat` that supports the chosen `locale`.
     */
    locale: PropTypes.string,
    /**
     * The ending of a range of valid dates for the end-date. The range includes the endDate.
     * The default value is current date + 100 years.
     */
    maxEndDate: PropTypes.object,
    /**
     * The ending of a range of valid dates for the start-date. The range includes the endDate.
     * The default value is current date + 100 years.
     */
    maxStartDate: PropTypes.object,
    /**
     * The beginning of a range of valid dates for the end-date. The range includes the startDate.
     * The default value is current date - 100 years.
     */
    minEndDate: PropTypes.object,
    /**
     * The beginning of a range of valid dates for the start-date. The range includes the startDate.
     * The default value is current date - 100 years.
     */
    minStartDate: PropTypes.object,
    /**
     * Tells the component to display the picker in portrait or landscape mode.
     */
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    /**
     * Override the default text of the 'OK' button.
     */
    okLabel: PropTypes.node,
    /**
     * Callback function that is fired when the date value changes.
     *
     * @param {null} null Since there is no particular event associated with the change,
     * the first argument will always be null.
     * @param {object} date The new date.
     */
    onChange: PropTypes.func,
    /**
     * Callback function that is fired when a touch tap event occurs on the Date Picker's `TextField`.
     *
     * @param {object} event TouchTap event targeting the `TextField`.
     */
    onClick: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's dialog is dismissed.
     */
    onDismiss: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's `TextField` gains focus.
     */
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's dialog is shown.
     */
    onShow: PropTypes.func,
    /**
     * Callback function used to determine if a day's entry should be disabled on the calendar.
     *
     * @param {object} day Date object of a day.
     * @returns {boolean} Indicates whether the day should be disabled.
     */
    shouldDisableDate: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Override the inline-styles of DatePicker's TextField element.
     */
    textFieldStyle: PropTypes.object,
    /**
     * This object should contain methods needed to build the calendar system.
     *
     * Useful for building a custom calendar system. Refer to the
     * [source code](https://github.com/callemall/material-ui/blob/master/src/DatePicker/dateUtils.js)
     * and an [example implementation](https://github.com/alitaheri/material-ui-persian-date-picker-utils)
     * for more information.
     */
    utils: PropTypes.object,
    /**
     * Sets the date for the Date Picker programmatically.
     */
    value: PropTypes.object,
  };

  static defaultProps = {
    autoOk: false,
    container: 'dialog',
    disabled: false,
    firstDayOfWeek: 1,
    style: {},
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    startDate: undefined,
    endDate: undefined,
  };

  componentWillMount() {
    this.setState({
      date: this.isControlled() ? this.getControlledDate() : undefined,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.isControlled()) {
      const newDates = this.getControlledDate(nextProps);
      if (!isEqualDate(this.state.startDate, newDates.start) || !isEqualDate(this.state.endDate, newDates.end)) {
        this.setState({
          startDate: newDates.start,
          endDate: newDates.end,
        });
      }
    }
  }

  getDates() {
    return {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
  }

  /**
   * Open the date-picker dialog programmatically from a parent.
   */
  openDialog() {
    /**
     * if the date is not selected then set it to new date
     * (get the current system date while doing so)
     * else set it to the currently selected date
     */
    if (this.state.date !== undefined) {
      this.setState({
        dialogStartDate: this.getDates().startDate,
        dialogEndDate: this.getDates().endDate,
      }, this.refs.dialogWindow.show);
    } else {
      this.setState({
        dialogStartDate: new Date(),
        dialogEndDate: this.props.utils.addDays(new Date(), 1),
      }, this.refs.dialogWindow.show);
    }
  }

  /**
   * Alias for `openDialog()` for an api consistent with TextField.
   */
  focus() {
    this.openDialog();
  }

  handleAccept = (dates) => {
    if (!this.isControlled()) {
      this.setState({
        startDate: dates.start,
        endDate: dates.end,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(null, dates);
    }
  };

  handleFocus = (event) => {
    event.target.blur();
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleTouchTap = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (!this.props.disabled) {
      setTimeout(() => {
        this.openDialog();
      }, 0);
    }
  };

  isControlled() {
    return this.props.hasOwnProperty('value');
  }

  getControlledDate(props = this.props) {
    if (props.value && (props.value.start instanceof Date || props.value.end instanceof Date)) {
      return props.value;
    }
  }

  formatDateForDisplay(date, dateFormatter, label) {
    return (date instanceof Date ? dateFormatter(date) : label);
  }

  formatDateRange(startDate, endDate, dateFormatter) {
    return `${this.formatDateForDisplay(startDate, dateFormatter, 'Start')} -
            ${this.formatDateForDisplay(endDate, dateFormatter, 'End')}`;
  }

  formatDate = (date) => {
    if (this.props.locale) {
      const DateTimeFormat = this.props.DateTimeFormat || dateTimeFormat;
      return new DateTimeFormat(this.props.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(date);
    } else {
      return formatIso(date);
    }
  };

  render() {
    const {
      DateTimeFormat,
      autoOk,
      cancelLabel,
      className,
      container,
      dialogContainerStyle,
      firstDayOfWeek,
      formatDate: formatDateProp,
      locale,
      maxStartDate,
      maxEndDate,
      minStartDate,
      minEndDate,
      mode,
      okLabel,
      onDismiss,
      onFocus, // eslint-disable-line no-unused-vars
      onShow,
      onClick, // eslint-disable-line no-unused-vars
      shouldDisableDate,
      style,
      textFieldStyle,
      utils,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const formatDate = formatDateProp || this.formatDate;

    return (
      <div className={className} style={prepareStyles(Object.assign({}, style))}>
        <TextField
          {...other}
          onFocus={this.handleFocus}
          onClick={this.handleTouchTap}
          ref="input"
          style={textFieldStyle}
          value={this.formatDateRange(this.state.startDate, this.state.endDate, formatDate)}
        />
        <DateRangePickerDialog
          DateTimeFormat={DateTimeFormat}
          autoOk={autoOk}
          cancelLabel={cancelLabel}
          container={container}
          containerStyle={dialogContainerStyle}
          firstDayOfWeek={firstDayOfWeek}
          initialStartDate={this.state.dialogStartDate}
          initialEndDate={this.state.dialogEndDate}
          locale={locale}
          maxStartDate={maxStartDate}
          maxEndDate={maxEndDate}
          minStartDate={minStartDate}
          minEndDate={minEndDate}
          mode={mode}
          okLabel={okLabel}
          onAccept={this.handleAccept}
          onShow={onShow}
          onDismiss={onDismiss}
          ref="dialogWindow"
          shouldDisableDate={shouldDisableDate}
          utils={utils}
        />
      </div>
    );
  }
}

export default DateRangePicker;
