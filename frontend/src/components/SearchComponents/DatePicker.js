/* DatePicker.js: Wrapped Pikaday into a React component
* prop 'placeholder' has a default value */

import React, { Component } from 'react';
import Pikaday from 'pikaday';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import moment from 'moment';
import './SearchBox.css';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.dateRef = React.createRef()
    }

    componentDidMount() {
        new Pikaday({
            field: this.dateRef.current,
            format: 'MM/DD/YYYY',
            onSelect: this.props.onChange,
        })
    }

    render() {
        const today = moment().toDate();
        today.setDate(today.getDate() - 1);
        return <div>
            {/*<input*/}
            {/*    type="text"*/}
            {/*    className={this.props.className}*/}
            {/*    ref={this.dateRef}*/}
            {/*    value={this.props.value}*/}
            {/*    placeholder={this.props.placeholder || "Choose Date..."}*/}
            {/*/>*/}
            <SemanticDatepicker
                // label="Departure Date"
                className="date-picker-box"
                onChange={this.props.onChange}
                value={this.props.startDate}
                name="startDate"
                format="MM/DD/YYYY"
                minDate={today}
                icon="calendar outline"
                iconPosition="left"
                required
                placeholder={this.props.placeholder || "Choose Date..."}
            />
        </div>
    }
}

export default DatePicker;
