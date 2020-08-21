import React, { Component } from 'react';
import './SearchBox.css';
import SearchBar from '../SearchBar/SearchBar';
import Pikaday from 'pikaday';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import DatePicker from './DatePicker';

const querystring = require('querystring');
const DEBUG = true;

const rideOptions = [
    {
        key: 'One Way',
        text: 'One Way',
        value: 'One Way',
    },
    {
        key: 'Roundtrip',
        text: 'Roundtrip',
        value: 'Roundtrip',
    },
];

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rides: [],
            filteredRides: [],
            roundtrip: false,
        };
    }

    changeRideType = (e, data) => {
        if (data.value === 'One Way') {
            this.setState({roundtrip: false})
        } else {
            this.setState({roundtrip: true})
        }
    };

    render() {
        const {roundtrip} = this.state;
        const renderReturnDate = () => {
            if (roundtrip) {
                return (
                    <div className="search-field">
                        <div className="field-desc">Return Date</div>
                        <DatePicker onChange={this.props.functions.editEndDate}
                                    className="date-picker-box input"
                                    value={this.props.query.endDate} />
                    </div>
                );
            }
        };
        return (
            <div>
                <div className="ride-type-wrapper">
                    <Dropdown className="ride-type-selector"
                              defaultValue="One Way"
                              selection
                              compact
                              onChange={this.changeRideType}
                              options={rideOptions}
                    />
                </div>
                <div className="search-box">
                    <div className="search-field">
                        <div className="field-desc">Start Location</div>
                        <SearchBar
                            className="input"
                            text={this.props.query.start}
                            editfn={this.props.functions.editStart}
                            placeholder="Choose Start Location..."
                        />
                    </div>
                    <div className="search-field">
                        <div className="field-desc">Destination</div>
                        <SearchBar
                            className="input"
                            text={this.props.query.endDest}
                            editfn={this.props.functions.editEndDest}
                            placeholder="Choose Destination..."
                        />
                    </div>
                    <div className="search-field">
                        <div className="field-desc">Depart Date</div>
                        <DatePicker onChange={this.props.functions.editBeginDate}
                                    className="date-picker-box input"
                                    value={this.props.query.beginDate} />
                    </div>
                    {renderReturnDate()}
                    <div onClick={this.props.functions.query} className="search-button">Search Rides</div>
                </div>
            </div>

        );
    }
}

export default SearchBox;
