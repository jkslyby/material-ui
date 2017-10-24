import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import Calendar from './Calendar';
import Dialog from '../Dialog';
import Popover from '../Popover/Popover';
import PopoverAnimationVertical from '../Popover/PopoverAnimationVertical';
import {dateTimeFormat} from './dateUtils';

class DateRangePickerDialog extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    firstDayOfWeek: PropTypes.number,
    initialEndDate: PropTypes.object,
    initialStartDate: PropTypes.object,
    locale: PropTypes.string,
    maxEndDate: PropTypes.object,
    maxStartDate: PropTypes.object,
    minEndDate: PropTypes.object,
    minStartDate: PropTypes.object,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    utils: PropTypes.object,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    cancelLabel: 'Cancel',
    container: 'dialog',
    locale: 'en-US',
    okLabel: 'OK',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  // state = {
  //   open: false,
  // };

  state = {
    end: {
      displayDate: undefined,
      displayMonthDay: undefined,
      selectedDate: undefined,
    },
    open: false,
    start: {
      displayDate: undefined,
      displayMonthDay: undefined,
      selectedDate: undefined,
    },
    transitionDirection: 'left',
    transitionEnter: true,
  };

  show = () => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }

    this.setState({
      open: true,
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }

    this.setState({
      open: false,
    });
  };

  handleTouchTapDay = () => {
    if (this.props.autoOk) {
      setTimeout(this.handleTouchTapOk, 300);
    }
  };

  handleTouchTapCancel = () => {
    this.dismiss();
  };

  handleRequestClose = () => {
    this.dismiss();
  };

  handleTouchTapOk = () => {
    // should return an object with start and end dates
    if (this.props.onAccept && !this.refs.startCalendar.isSelectedDateDisabled() &&
       !this.refs.endCalendar.isSelectedDateDisabled()) {
      this.props.onAccept({
        start: this.refs.startCalendar.getSelectedDate(),
        end: this.refs.endCalendar.getSelectedDate(),
      });
    }

    this.setState({
      open: false,
    });
  };

  handleWindowKeyUp = (event) => {
    switch (keycode(event)) {
      case 'enter':
        this.handleTouchTapOk();
        break;
    }
  };

  render() {
    const {
      DateTimeFormat,
      autoOk,
      cancelLabel,
      container,
      containerStyle,
      initialStartDate,
      initialEndDate,
      firstDayOfWeek,
      locale,
      maxEndDate,
      maxStartDate,
      minEndDate,
      minStartDate,
      mode,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      shouldDisableDate,
      style, // eslint-disable-line no-unused-vars
      animation,
      utils,
      ...other
    } = this.props;

    const {open} = this.state;

    const styles = {
      dialogContent: {
        width: 310,
      },
      dialogBodyContent: {
        padding: 0,
        minHeight: 330,
        minWidth: 310,
      },
    };

    const Container = (container === 'inline' ? Popover : Dialog);

    return (
      <div {...other} ref="root">
        <Container
          anchorEl={this.refs.root} // For Popover
          animation={animation || PopoverAnimationVertical} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          ref="dialog"
          repositionOnUpdate={true}
          open={open}
          onRequestClose={this.handleRequestClose}
          style={Object.assign(styles.dialogBodyContent, containerStyle)}
        >
          <EventListener
            target="window"
            onKeyUp={this.handleWindowKeyUp}
          />

          <RangeCalendar
            autoOk={autoOk}
            DateTimeFormat={DateTimeFormat}
            cancelLabel={cancelLabel}
            disableYearSelection={true}
            firstDayOfWeek={firstDayOfWeek}
            initialDate={initialStartDate}
            locale={locale}
            onTouchTapDay={this.handleTouchTapDay}
            maxDate={maxStartDate}
            minDate={minStartDate}
            mode={mode}
            open={open}
            ref="startCalendar"
            onTouchTapCancel={this.handleTouchTapCancel}
            onTouchTapOk={this.handleTouchTapOk}
            okLabel={okLabel}
            openToYearSelection={false}
            shouldDisableDate={shouldDisableDate}
            hideCalendarDate={true}
            utils={utils}
          />


        </Container>
      </div>
    );
  }
}

export default DateRangePickerDialog;
