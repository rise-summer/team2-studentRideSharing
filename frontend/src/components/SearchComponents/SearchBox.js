import React, { Component } from 'react';
import './SearchBox.css';
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react';
import DatePicker from './DatePicker';
import GeoSearch from '../../components/GeoSearch/GeoSearch';

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
                        // className="ride-type-selector"
                        text={this.props.functions.getRideType()}
                        value={this.props.functions.getRideType()}
                        selection
                        compact
                        onChange={this.props.functions.changeRideType}
                        options={rideOptions}
                    />
                </div>
                <div className="search-box">
                    <div className="search-field">
                        <div className="field-desc">Start Location</div>
                        <GeoSearch
                            handleChange={this.props.functions.handleGeoChange}
                            placeholder="Choose Start location..."
                            name="start"
                            types="region,postcode,district,place,locality,neighborhood,address,poi"
                        />
                    </div>
                    <div className="search-field">
                        <div className="field-desc">Destination</div>
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
                            value={this.props.query.beginDate}
                        />
                    </div>
                    {renderReturnDate()}
                    <div onClick={this.props.functions.query} className="search-button">Search Rides</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    query: state.query
});

export default connect(mapStateToProps)(SearchBox);
