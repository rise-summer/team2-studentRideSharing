import React, {Component} from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import RideList from "../components/RidesList/RideList";
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

class Search extends Component {
    constructor(props) {
        // new Date(year, month, date, hours, minutes, seconds, ms)
        super(props);
        this.state = {
            start: '',
            endDest: '',
            rides: [
                ['UCI', 'UCB', new Date(2020, 7, 21, 10, 0)],
                ['UCLA', 'UCSD', new Date(2020, 7, 24, 12, 15)],
                ['USC', 'Stanford', new Date(2020, 7, 27, 14, 30)],
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
            format: 'MM/DD/YYYY',
            onSelect: this.editStartDate,
        });

        new Pikaday({
            field: this.endDateRef.current,
            format: 'MM/DD/YYYY',
            onSelect: this.editEndDate,
        });
    }

    editStart = (sd) => {this.setState({start: sd.target.value})};
    editEndDest = (ed) => {this.setState({endDest: ed.target.value})};
    editStartDate = (date) => {
        this.setState({startDate: date})
    };
    editEndDate = (date) =>{
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
        // console.log('this.state.startDate: ' + this.state.startDate);
        this.setState({
            filteredRides: this.state.rides.filter(dest =>
                (dest[0].toLowerCase().includes(this.state.start.toLowerCase()) &&
                    dest[1].toLowerCase().includes(this.state.endDest.toLowerCase()))
            )
            // && dest[2].getTime() === this.state.startDate
        })
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
            <div>
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
                    type="text"
                    ref={this.startDateRef}
                    onChange={this.editStartDate}
                    value={this.state.startDate}
                    placeholder='Departure Date'
                />
                <input
                    type="text"
                    ref={this.endDateRef}
                    onChange={this.editEndDate}
                    value={this.state.endDate}
                />


                <button onClick={this.filterRides}>Search</button>
                <button onClick={this.clearFilter}>Clear</button>
                <h3>Available Rides</h3>
                {/*<RideList rides={this.ridefilter()}/>*/}
                <RideList rides={this.state.filteredRides}/>

            </div>
        );
    }
}

export default Search;
