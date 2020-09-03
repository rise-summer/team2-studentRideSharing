import React, { Component } from 'react';
import './SearchBox.css';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
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
            this.setState({ roundtrip: false });
        } else {
            this.setState({ roundtrip: true });
        }
    };

    render() {
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
                    <Form onSubmit={this.props.functions.query}>
                        <Form.Group>
                            <Form.Input label="Start Location">
                                <GeoSearch
                                    className="geoSearch"
                                    handleChange={
                                        this.props.functions.handleGeoChange
                                    }
                                    placeholder="Choose Start location..."
                                    name="start"
                                    types="region,postcode,district,place,locality,neighborhood,address,poi"
                                />
                            </Form.Input>
                            <Form.Input label="Destination">
                                <GeoSearch
                                    className="geoSearch"
                                    handleChange={
                                        this.props.functions.handleGeoChange
                                    }
                                    placeholder="Choose Destination..."
                                    name="endDest"
                                    types="region,postcode,district,place,locality,neighborhood,address,poi"
                                />
                            </Form.Input>
                            <DatePicker
                                label="Depart Date"
                                onChange={this.props.functions.editBeginDate}
                                value={this.props.query.beginDate}
                            />
                            {this.props.refs.roundtrip && (
                                <DatePicker
                                    label="Return Date"
                                    onChange={this.props.functions.editEndDate}
                                    className="date-picker-box input"
                                    value={this.props.query.endDate}
                                />
                            )}
                            <Form.Button
                                style={{ marginTop: '20px' }}
                                primary
                                content="Search Rides"
                            />
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    query: state.query,
});

export default connect(mapStateToProps)(SearchBox);
