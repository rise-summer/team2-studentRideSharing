import React, { Component } from 'react';
import './SearchBox.css';
import SearchBar from '../SearchBar/SearchBar';
import Pikaday from 'pikaday';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import DatePicker from './DatePicker';
import GeoSearch from '../../components/GeoSearch/GeoSearch';

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
        const renderReturnDate = () => {
            if (this.props.refs.roundtrip) {
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
                    <Dropdown
                        className="ride-type-selector"
                        text={this.props.functions.getRideType()}
                        value={this.props.functions.getRideType}
                        selection
                        compact
                        onChange={this.props.functions.changeRideType}
                        options={rideOptions}
                    />
                </div>
                <div className="search-box">
                    <div className="search-field">
                        <div className="field-desc">Start Location</div>
                        {/*<SearchBar*/}
                        {/*    className="input"*/}
                        {/*    text={this.props.query.start}*/}
                        {/*    editfn={this.props.functions.editStart}*/}
                        {/*    placeholder="Choose Start Location..."*/}
                        {/*/>*/}
                        <GeoSearch
                            handleChange={this.props.functions.handleGeoChange}
                            placeholder="Choose Start location..."
                            name="endDest"
                            types="region,postcode,district,place,locality,neighborhood,address,poi"
                        />
                    </div>
                    <div className="search-field">
                        <div className="field-desc">Destination</div>
                        {/*<SearchBar*/}
                        {/*    className="input"*/}
                        {/*    text={this.props.query.endDest}*/}
                        {/*    editfn={this.props.functions.editEndDest}*/}
                        {/*    placeholder="Choose Destination..."*/}
                        {/*/>*/}
                        <GeoSearch
                            className="input"
                            handleChange={this.props.functions.handleGeoChange}
                            placeholder="Choose Destination..."
                            name="endDest"
                            types="region,postcode,district,place,locality,neighborhood,address,poi"
                        />
                    </div>
                    <div className="search-field">
                        <div className="field-desc">Depart Date</div>
                        <DatePicker
                            onChange={this.props.functions.editBeginDate}
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
