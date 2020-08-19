import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar/SearchBar';
import RideList from '../../components/Rides/RideList';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';
import './Search.css';
import { Dropdown } from 'semantic-ui-react';
import GeoSearch from '../../components/GeoSearch/GeoSearch';
import { Link } from 'react-router-dom';
import { SEARCH_RIDES_SUCCESS } from '../../actions/SearchPageStates';
import {
    getRidesError,
    getRidesSuccess,
} from '../../reducers/SearchRidesReducer';

const querystring = require('querystring');
const DEBUG = true;

const sample_rides = [
    ['UCI', 'UCB', new Date(2020, 6, 21, 10, 0)],
    ['UCLA', 'UCSD', new Date(2020, 6, 24, 12, 15)],
    ['USC', 'Stanford', new Date(2020, 6, 27, 14, 30)],
];

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

class Search extends Component {
    constructor(props) {
        // new Date(year, month, date, hours, minutes, seconds, ms)
        super(props);
        this.state = {
            start: {},
            endDest: {},
            beginDate: '',
            endDate: '',
            distance: 5,
            // rides: sample_rides,
            rides: [],
            filteredRides: [],
            roundtrip: false,
            /* Use this.state.query.* when passing to redux */
            query: {
                start: {},
                endDest: {},
                time: '',
                distance: '',
            },
        };
        this.state.filteredRides = this.state.rides;
        this.beginDateRef = React.createRef();
        this.endDateRef = React.createRef();
    }

    componentDidMount() {
        new Pikaday({
            field: this.beginDateRef.current,
            onSelect: this.editBeginDate,
        });

        new Pikaday({
            field: this.endDateRef.current,
            onSelect: this.editEndDate,
        });
    }

    handleGeoChange = (resp, fieldName) => {
        this.setState({
            [fieldName]: resp,
        });
    };

    editBeginDate = (d) => {
        let date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({ beginDate: date });
    };

    editEndDate = (d) => {
        let date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({ endDate: date });
    };

    /* filter upon button click */
    filterRides = () => {
        // split searched departure date into array
        var dateArray = this.state.beginDate.split('/');
        // create Date object from array information
        // new Date(YYYY, MM, DD), month is 0-indexed
        var date = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);

        this.setState({
            filteredRides: this.state.rides.filter((dest) =>
                this.checkMatch(dest, dateArray, date)
            ),
        });
    };

    queryRides = () => {
        // this.props.dispatch({type: SEARCH_RIDES_SUCCESS});
        /* dates are store as strings in this.state, must convert to Date object */
        const date = new Date(this.state.beginDate);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59);
        const { start, endDest } = this.state;
        const query = {
            originCoords: [start.lng, start.lat],
            destCoords: [endDest.lng, endDest.lat],
            beginDate: date,
            endDate: dateEnd,
            distance: this.state.distance,
        };
        const xurl =
            '/api/rides?' +
            querystring.stringify({ query: JSON.stringify(query) });
        console.log(xurl);
        fetch(xurl)
            .then((res) => res.json())
            .then((res) => {
                if (DEBUG) {
                    console.log(res);
                }
                const queried_rides = [];
                for (let ride in res) {
                    queried_rides.push([
                        res[ride].startLoc.city +
                            ', ' +
                            res[ride].startLoc.state,
                        res[ride].endLoc.city + ', ' + res[ride].endLoc.state,
                        new Date(res[ride].time),
                    ]);
                }
                this.setState({
                    filteredRides: queried_rides,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // helper function for filterRides()
    checkMatch = (dest, dateArray, date) => {
        var startMatch = dest[0]
            .toLowerCase()
            .includes(this.state.start.toLowerCase());
        var destMatch = dest[1]
            .toLowerCase()
            .includes(this.state.endDest.toLowerCase());
        var dateMatch =
            dateArray.length === 1 ||
            (date.getFullYear() === dest[2].getFullYear() &&
                date.getMonth() === dest[2].getMonth() &&
                date.getDate() === dest[2].getDate());
        return startMatch && destMatch && dateMatch;
    };

    clearFilter = () => {
        this.setState({
            start: '',
            endDest: '',
            filteredRides: this.state.rides,
            beginDate: '',
            endDate: '',
        });
    };

    changeRideType = (e, data) => {
        if (data.value === 'One Way') {
            this.setState({ roundtrip: false });
        } else {
            this.setState({ roundtrip: true });
        }
    };

    render() {
        const { roundtrip } = this.state;
        const renderReturnDate = () => {
            if (roundtrip) {
                return (
                    <div className="search-field">
                        <div className="field-desc">Return Date</div>
                        <input
                            className="date-picker-box input"
                            type="text"
                            ref={this.endDateRef}
                            onChange={this.editEndDate}
                            value={this.state.endDate}
                            placeholder="Choose Date..."
                        />
                    </div>
                );
            }
        };
        return (
            <div className="search-wrapper">
                <div className="search-subwrapper">
                    <div className="ride-type-wrapper">
                        <Dropdown
                            className="ride-type-selector"
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
                            <GeoSearch
                                handleChange={this.handleGeoChange}
                                placeholder="Choose Start Location..."
                                name="start"
                                types="region,postcode,district,place,locality,neighborhood,address,poi"
                            />
                        </div>
                        <div className="search-field">
                            <div className="field-desc">Destination</div>
                            <GeoSearch
                                handleChange={this.handleGeoChange}
                                placeholder="Choose Destination..."
                                name="endDest"
                                types="region,postcode,district,place,locality,neighborhood,address,poi"
                            />
                        </div>
                        <div className="search-field">
                            <div className="field-desc">Depart Date</div>
                            <input
                                className="date-picker-box input"
                                type="text"
                                ref={this.beginDateRef}
                                onChange={this.editBeginDate}
                                value={this.state.beginDate}
                                placeholder="Choose Date..."
                            />
                        </div>
                        {renderReturnDate()}
                        <div
                            onClick={this.queryRides}
                            className="search-button"
                        >
                            Search Rides
                        </div>
                    </div>
                </div>
                <br />
                {/*<button onClick={this.clearFilter}>Clear</button>*/}
                {/*<button onClick={this.queryRides}>Search DB</button>*/}
                <h3>Available Rides</h3>
                <RideList rides={this.state.filteredRides} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    start: state.start,
    endDest: state.endDest,
    rides: state.rides,
    filteredRides: state.filteredRides,
    beginDate: state.beginDate,
    endDate: state.endDate,
});

// export default Search;
export default connect(mapStateToProps)(Search);
