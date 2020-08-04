import React, {Component} from 'react';
import {connect} from 'react-redux';
import SearchBar from '../../components/SearchBar/SearchBar';
import RideList from "../../components/RidesList/RideList";
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';
import './Search.css'
import {Link} from 'react-router-dom';
import {SEARCH_RIDES_SUCCESS} from "../../actions/SearchPageStates";
import {getRidesError, getRidesSuccess} from "../../reducers/SearchRidesReducer";

const xurl = 'http://localhost:3000/api/rides?query=%7B%22originCoords%22%3A%5B-119.159392%2C34.164958%5D%2C%22destCoords%22%3A%5B-117.221505%2C32.873788%5D%2C%22beginDate%22%3A%222020-07-23T20%3A00%3A00.000Z%22%2C%22endDate%22%3A%222020-07-23T21%3A00%3A00.000Z%22%2C%22distance%22%3A5%7D'

const sample_rides = [
    ['UCI', 'UCB', new Date(2020, 6, 21, 10, 0)],
    ['UCLA', 'UCSD', new Date(2020, 6, 24, 12, 15)],
    ['USC', 'Stanford', new Date(2020, 6, 27, 14, 30)],
];

class Search extends Component {
    constructor(props) {
        // new Date(year, month, date, hours, minutes, seconds, ms)
        super(props);
        this.state = {
            start: '',
            endDest: '',
            rides: sample_rides,
            filteredRides: [],
            startDate: '',
            endDate: '',
        };
        this.state.filteredRides = this.state.rides;
        this.startDateRef = React.createRef();
        this.endDateRef = React.createRef();
    }

    componentDidMount() {
        new Pikaday({
            field: this.startDateRef.current,
            onSelect: this.editStartDate,
        });

        new Pikaday({
            field: this.endDateRef.current,
            onSelect: this.editEndDate,
        });
    }

    editStart = (sd) => {
        this.setState({start: sd.target.value})
    };

    editEndDest = (ed) => {
        this.setState({endDest: ed.target.value})
    };

    editStartDate = (d) => {
        var date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({startDate: date})
    };

    editEndDate = (d) => {
        var date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({endDate: date})
    };

    /* for automatic ride filtering */
    ridefilter = () => {
        const rides = this.state.rides;
        return rides.filter(dest =>
            (dest[0].toLowerCase().includes(this.state.start.toLowerCase()) &&
                dest[1].toLowerCase().includes(this.state.endDest.toLowerCase())));
    };

    /* filter upon button click */
    filterRides = () => {
        // split searched departure date into array
        var dateArray = this.state.startDate.split('/');
        // create Date object from array information
        // new Date(YYYY, MM, DD), month is 0-indexed
        var date = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);

        this.setState({
            filteredRides: this.state.rides.filter(dest => this.checkMatch(dest, dateArray, date))
        })
    };

    queryRides = () => {
        // this.props.dispatch({type: SEARCH_RIDES_SUCCESS});
        fetch(xurl)
            .then(res => res.json())
            .then(res => {
                console.log(res); /*****/
                const queried_rides = [];
                for (let ride in res) {
                    queried_rides.push(
                        [
                            res[ride].startLoc.city + ', ' + res[ride].startLoc.state,
                            res[ride].endLoc.city + ', ' + res[ride].endLoc.state,
                            new Date(res[ride].time),
                        ]
                    )
                }
                this.setState({
                    filteredRides: queried_rides
                });
                console.log(queried_rides);
            })
    };

    // helper function for filterRides()
    checkMatch = (dest, dateArray, date) => {
        var startMatch = dest[0].toLowerCase().includes(this.state.start.toLowerCase());
        var destMatch = dest[1].toLowerCase().includes(this.state.endDest.toLowerCase());
        var dateMatch = dateArray.length === 1 ||
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
            startDate: '',
            endDate: '',
        })
    };

    render() {
        return (
            <div className="search-wrapper">
                <div className="search-details">
                    <SearchBar
                        className="start-location"
                        text={this.state.start}
                        editfn={this.editStart}
                        placeholder="Choose Starting Point..."
                    />
                    <SearchBar
                        className="end-dest"
                        text={this.state.endDest}
                        editfn={this.editEndDest}
                        placeholder="Choose Destination..."
                    />
                    <input
                        className="date-picker-box"
                        type="text"
                        ref={this.startDateRef}
                        onChange={this.editStartDate}
                        value={this.state.startDate}
                        placeholder="Departure Date"
                    />
                </div>
                <br/>
                <button onClick={this.filterRides}>Search</button>
                <button onClick={this.clearFilter}>Clear</button>
                <button onClick={this.queryRides}>Search DB</button>
                <h3>Available Rides</h3>
                {/*<RideList rides={this.ridefilter}/>*/}
                <RideList rides={this.state.filteredRides}/>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    start: state.start,
    endDest: state.endDest,
    rides: state.rides,
    filteredRides: state.filteredRides,
    startDate: state.startDate,
    endDate: state.endDate,
});

// export default Search;
export default connect(mapStateToProps)(Search);
