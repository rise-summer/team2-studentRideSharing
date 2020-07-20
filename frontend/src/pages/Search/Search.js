import React, {Component} from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import RideList from "../../components/RidesList/RideList";
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';
import './Search.css'

class Search extends Component {
    constructor(props) {
        // new Date(year, month, date, hours, minutes, seconds, ms)
        super(props);
        this.state = {
            start: '',
            endDest: '',
            rides: [
                ['UCI', 'UCB', new Date(2020, 6, 21, 10, 0)],
                ['UCLA', 'UCSD', new Date(2020, 6, 24, 12, 15)],
                ['USC', 'Stanford', new Date(2020, 6, 27, 14, 30)],
            ],
            filteredRides: [],
            startDate: '',
            endDate: '',
        };
        this.state.filteredRides = this.state.rides;
        this.startDateRef = React.createRef();
        this.endDateRef = React.createRef();
    }

    componentDidMount () {
        new Pikaday({
            field: this.startDateRef.current,
            onSelect: this.editStartDate,
        });

        new Pikaday({
            field: this.endDateRef.current,
            onSelect: this.editEndDate,
        });
    }

    editStart = (sd) => {this.setState({start: sd.target.value})};

    editEndDest = (ed) => {this.setState({endDest: ed.target.value})};

    editStartDate = (d) => {
        var date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({startDate: date})
    };

    editEndDate = (d) =>{
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
        var dateArray  = this.state.startDate.split('/');
        // create Date object from array information
        // new Date(YYYY, MM, DD), month is 0-indexed
        var date = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);

        this.setState({
            filteredRides: this.state.rides.filter(dest => this.checkMatch(dest, dateArray, date))
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
            <div className='search-wrapper'>
                <SearchBar
                    text={this.state.start}
                    editfn={this.editStart}
                    placeholder='Choose Starting Point...'
                />
                <SearchBar
                    text={this.state.endDest}
                    editfn={this.editEndDest}
                    placeholder='Choose Destination...'
                />

                <input
                    className='date-picker-box'
                    type="text"
                    ref={this.startDateRef}
                    onChange={this.editStartDate}
                    value={this.state.startDate}
                    placeholder='Departure Date'
                />
                <br/>
                <button onClick={this.filterRides}>Search</button>
                <button onClick={this.clearFilter}>Clear</button>
                <h3>Available Rides</h3>
                {/*<RideList rides={this.ridefilter}/>*/}
                <RideList rides={this.state.filteredRides}/>

            </div>
        );
    }
}

export default Search;
