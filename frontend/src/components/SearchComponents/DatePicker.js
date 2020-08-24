/* DatePicker.js: Wrapped Pikaday into a React component
* prop 'placeholder' has a default value */

import React, { Component } from 'react';
import Pikaday from 'pikaday';

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
        return <div>
            <input type="text"
                   className={this.props.className}
                   ref={this.dateRef}
                   value={this.props.value}
                   placeholder={this.props.placeholder || "Choose Date..."}
            />
        </div>
    }
}

export default DatePicker;
