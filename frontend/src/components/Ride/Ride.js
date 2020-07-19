import React, {Component} from 'react';
import './Ride.css';

class Ride extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    formatTime = (t) => {
        const year = t.getFullYear();
        const month = t.getMonth();
        const date = t.getDate();
        var hour = t.getHours();

        var mins = t.getMinutes();
        if (mins < 10) { mins = '0' + mins; }
        const period = (hour < 12) ? 'AM' : 'PM';
        if (hour > 12) {hour -= 12;}

        return month + '-' + date + '-' + year + ' at ' + hour + ':' + mins + ' ' + period;
    };

    render() {
        return (
            <div className='ride'>
                <div><b>Departing From: {this.props.start}</b></div>
                <div><b>Departure Time: {this.formatTime(this.props.time)}</b></div>
                <div><b>Destination: {this.props.dest}</b></div>
            </div>
        )
    }
}

export default Ride;
