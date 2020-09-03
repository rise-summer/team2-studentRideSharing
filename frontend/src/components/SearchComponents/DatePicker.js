/* DatePicker.js: Wrapped Pikaday into a React component
* prop 'placeholder' has a default value */

import React, { Component } from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import moment from 'moment';
import './SearchBox.css';

class DatePicker extends Component {
    render() {
        const today = moment().toDate();
        today.setDate(today.getDate() - 1);
        return <div>
            <SemanticDatepicker
                // label="Departure Date"
                className="date-picker-box"
                onChange={this.props.onChange}
                value={this.props.value}
                name="startDate"
                format="MM/DD/YYYY"
                minDate={today}
                icon="calendar outline"
                iconPosition="left"
                required
                placeholder={this.props.placeholder || "Choose Date..."}
                autoComplete="off"
            />
        </div>
    }
}

export default DatePicker;
