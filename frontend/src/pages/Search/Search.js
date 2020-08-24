import React, { Component } from 'react';
import { connect } from 'react-redux';
import RideList from '../../components/Rides/RideList';
import 'pikaday/css/pikaday.css';
import moment from 'moment';
import './Search.css';
import { SEARCH_RIDES_SUCCESS } from '../../actions/SearchPageStates';
import { getRidesError, getRidesSuccess } from '../../reducers/SearchRidesReducer';
import SearchLanding from '../../components/SearchComponents/SearchLanding';
import SearchBox from '../../components/SearchComponents/SearchBox';

const querystring = require('querystring');
const DEBUG = true;

class Search extends Component {
    constructor(props) {
        // new Date(year, month, date, hours, minutes, seconds, ms)
        super(props);
        this.state = {
            // rides: [],
            rides: {
                outboundRides: [],
                returnRides: []
            },
            filteredRides: [],
            roundtrip: false,
            searched: false,
            query: {
                start: null,
                endDest: null,
                beginDate: '',
                endDate: '',
                originCoords: '',
                destCoords: '',
                time: '',
                distance: '',
            },
        };
        this.state.filteredRides = this.state.rides;
    }

    // TODO: We could just store coords. The input value is stored in the GeoSearch component,
    // and coords are the only thing needed for the API call
    handleGeoChange = (resp, fieldName) => {
        this.setState({
            [fieldName]: resp,
        });
    };

    editBeginDate = (d) => {
        let date = moment(d).format('MM/DD/YYYY') + ' ';
        let newQuery = this.state.query;
        newQuery.beginDate = date;
        this.setState({ query: newQuery });
    };

    editEndDate = (d) => {
        let date = moment(d).format('MM/DD/YYYY') + ' ';
        let newQuery = this.state.query;
        newQuery.endDate = date;
        this.setState({ query: newQuery })
    };

    queryRides = () => {
        // this.props.dispatch({type: SEARCH_RIDES_SUCCESS});
        /* dates are store as strings in this.state, must convert to Date object */
        this.setState({ searched: true });
        const date = new Date(this.state.query.beginDate);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59);
        const { start, endDest, distance } = this.state.query;
        /* If no distance specified, default to 5 */
        const dist = (distance) ? distance : 5;
        const origin = (start) ? [start.lng, start.lat] : '';
        const dest = (endDest) ? [endDest.lng, endDest.lat] : '';
        const outboundQuery = {
            originCoords: origin,
            destCoords: dest,
            beginDate: date,
            endDate: dateEnd,
            distance: dist,
        };
        this.queryOutbound(outboundQuery);

        // if roundtrip selected
        const returnDate = new Date(this.state.query.endDate);
        const returnDateEnd = new Date(returnDate);
        returnDateEnd.setHours(23, 59, 59);
        const returnQuery = {
            originCoords: dest,
            destCoords: origin,
            beginDate: returnDate,
            endDate: returnDateEnd,
            distance: dist,
        };
        this.queryReturn(returnQuery);
    };

    queryOutbound = (query) => {
        const xurl =
            '/api/rides?' +
            querystring.stringify({ query: JSON.stringify(query) });
        fetch(xurl)
            .then((res) => res.json())
            .then((res) => {
                if (DEBUG) {
                    console.log(res);
                }
                const queried_rides = res.map((ride) => ({
                    startLoc: ride.startLoc,
                    endLoc: ride.endLoc,
                    time: ride.time,
                    rideID: ride._id,
                    driverID: ride.driverID,
                }));
                const newRides = this.state.rides;
                newRides.outboundRides = queried_rides;
                this.setState({
                    rides: newRides,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    queryReturn = (query) => {
        const xurl =
            '/api/rides?' +
            querystring.stringify({ query: JSON.stringify(query) });
        fetch(xurl)
            .then((res) => res.json())
            .then((res) => {
                if (DEBUG) {
                    console.log(res);
                }
                const queried_rides = res.map((ride) => ({
                    startLoc: ride.startLoc,
                    endLoc: ride.endLoc,
                    time: ride.time,
                    rideID: ride._id,
                    driverID: ride.driverID,
                }));
                const newRides = this.state.rides;
                newRides.returnRides = queried_rides;
                this.setState({
                    rides: newRides,
                });
            })
            .catch((error) => {
                console.log(error);
            });
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

    getRideType = () => {
        if (this.state.roundtrip) {
            return "Roundtrip";
        } else {
            return "One Way";
        }
    };

    render() {
        const functions = {
            editBeginDate: this.editBeginDate,
            editEndDate: this.editEndDate,
            query: this.queryRides,
            changeRideType: this.changeRideType,
            getRideType: this.getRideType,
            handleGeoChange: this.handleGeoChange,
        };

        const refs = {
            beginDateRef: this.beginDateRef,
            endDateRef: this.endDateRef,
            roundtrip: this.state.roundtrip,
        };

        let searchPage;
        let rideResults;
        if (!this.state.searched) {
            searchPage = <SearchLanding query={this.state.query} functions={functions} refs={refs} />
        } else {
            searchPage =
                <SearchBox
                    query={this.state.query}
                    functions={functions}
                    refs={refs}
                />;
            rideResults =
                <div>
                    <br />
                    <h3>Available Rides</h3>
                    <RideList roundtrip={this.state.roundtrip} rides={this.state.rides} />
                </div>;
        }

        return (
            <div className="search-wrapper">
                {searchPage}
                {rideResults}
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

export default connect(mapStateToProps)(Search);
