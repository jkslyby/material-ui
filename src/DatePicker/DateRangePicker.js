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
     * Used to block datetime ranges on the date range picker
     */
    blockedDateTimeRanges: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * The end datetime of a blocked range
         */
        end: PropTypes.object,
        /**
         * The start datetime of a blocked range
         */
        start: PropTypes.object,
      })
    ),
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
     * Override the inline-styles of DatePickerDialog's Container element.
     */
    dialogContainerStyle: PropTypes.object,
    /**
     * Disables the DatePicker.
     */
    disabled: PropTypes.bool,
    /**
     * This is the container for attributes and methods specific to the 'end' calendar.
     */
    end: PropTypes.shape({
      /**
       * This is the initial date value of the component.
       * If either `value` or `valueLink` is provided they will override this
       * prop with `value` taking precedence.
       */
      defaultDate: PropTypes.object,
      /**
       * The ending of a range of valid dates. The range includes the endDate.
       * The default value is current date + 100 years.
       */
      maxDate: PropTypes.object,
      /**
       * The beginning of a range of valid dates. The range includes the startDate.
       * The default value is current date - 100 years.
       */
      minDate: PropTypes.object,
      /**
       * Callback function used to determine if a day's entry should be disabled on the calendar.
       *
       * @param {object} day Date object of a day.
       * @returns {boolean} Indicates whether the day should be disabled.
       */
      shouldDisableDate: PropTypes.func,
    }),
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
     * This is the container for attributes and methods specific to the 'start' calendar.
     */
    start: PropTypes.shape({
      /**
       * This is the initial date value of the component.
       * If either `value` or `valueLink` is provided they will override this
       * prop with `value` taking precedence.
       */
      defaultDate: PropTypes.object,
      /**
       * The ending of a range of valid dates. The range includes the endDate.
       * The default value is current date + 100 years.
       */
      maxDate: PropTypes.object,
      /**
       * The beginning of a range of valid dates. The range includes the startDate.
       * The default value is current date - 100 years.
       */
      minDate: PropTypes.object,
      /**
       * Callback function used to determine if a day's entry should be disabled on the calendar.
       *
       * @param {object} day Date object of a day.
       * @returns {boolean} Indicates whether the day should be disabled.
       */
      shouldDisableDate: PropTypes.func,
    }),
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Override the inline-styles of DatePicker's TextField element.
     */
    textFieldStyle: PropTypes.object,
    /**
     * Tells the component to hide or show the underline in the text field component
     */
    underlineShow: PropTypes.bool,
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
    value: PropTypes.shape({
      /**
       * The end date
       */
      end: PropTypes.object,
      /**
       * The start date
       */
      start: PropTypes.object,
    }),
  };

  static defaultProps = {
    autoOk: false,
    container: 'dialog',
    disabled: false,
    firstDayOfWeek: 1,
    style: {},
    underlineShow: true,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    startDate: undefined,
    endDate: undefined,
  };

  componentWillMount() {
    const newDates = this.getControlledDate();
    if (this.isControlled() && newDates) {
      this.setState({
        startDate: newDates.start,
        endDate: newDates.end,
      });
    } else {
      this.setState({
        startDate: undefined,
        endDate: undefined,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isControlled()) {
      const newDates = this.getControlledDate(nextProps);
      if (newDates) {
        if (newDates.start && newDates.end && !isEqualDate(this.state.startDate, newDates.start) ||
            !isEqualDate(this.state.endDate, newDates.end)) {
          this.setState({
            startDate: newDates.start,
            endDate: newDates.end,
          });
        }
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
    if (this.state.startDate !== undefined && this.state.endDate !== undefined) {
      this.setState({
        dialogStartDate: this.getDates().startDate,
        dialogEndDate: this.getDates().endDate,
      }, this.refs.dialogWindow.show);
    } else {
      this.setState({
        dialogStartDate: new Date(),
        dialogEndDate: new Date(),
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
    if (date instanceof Date) {
      const day = date.getDate();
      const month = date.getMonth();
      let hour = date.getHours();
      const ampm = (hour < 12 ? 'AM' : 'PM');
      hour = hour % 12;

      return `${month}/${day} ${hour} ${ampm}`;
    } else {
      return label;
    }
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
      blockedDateTimeRanges,
      cancelLabel,
      className,
      container,
      dialogContainerStyle,
      end,
      firstDayOfWeek,
      formatDate: formatDateProp,
      locale,
      mode,
      okLabel,
      onDismiss,
      onFocus, // eslint-disable-line no-unused-vars
      onShow,
      onClick, // eslint-disable-line no-unused-vars
      start,
      style,
      textFieldStyle,
      underlineShow,
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
          ref="inputdaterangepicker"
          underlineShow={underlineShow}
          style={textFieldStyle}
          value={this.formatDateRange(this.state.startDate, this.state.endDate, formatDate)}
        />
        <DateRangePickerDialog
          DateTimeFormat={DateTimeFormat}
          autoOk={autoOk}
          blockedDateTimeRanges={blockedDateTimeRanges}
          cancelLabel={cancelLabel}
          container={container}
          containerStyle={dialogContainerStyle}
          end={end}
          firstDayOfWeek={firstDayOfWeek}
          initialStartDate={this.state.dialogStartDate}
          initialEndDate={this.state.dialogEndDate}
          locale={locale}
          mode={mode}
          okLabel={okLabel}
          onAccept={this.handleAccept}
          onShow={onShow}
          onDismiss={onDismiss}
          ref="dialogWindow"
          start={start}
          utils={utils}
        />
      </div>
    );
  }
}

export default DateRangePicker;
