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
            onSelect: this.onChangeStart,
            value: this.state.startDate,
        });

        new Pikaday({
            field: this.endDateRef.current,
            format: 'MM/DD/YYYY',
            onSelect: this.onChangeStart,
            value: this.state.endDate,
        });
    }

    editStart = (sd) => {this.setState({start: sd.target.value})};
    editEndDest = (ed) => {this.setState({endDest: ed.target.value})};
    editStartDate = (date) => {this.setState({startDate: date.target.value})};
    editEndDate = (date) =>{this.setState({endDate: date.target.value})};

    /* for automatic ride filtering */
    ridefilter = () => {
        const rides = this.state.rides;
        return rides.filter(dest =>
            (dest[0].toLowerCase().includes(this.state.start.toLowerCase()) &&
            dest[1].toLowerCase().includes(this.state.endDest.toLowerCase())));
    };

    /* filter upon button click */
    filterRides = () => {
        this.setState({
            filteredRides: this.state.rides.filter(dest =>
                (dest[0].toLowerCase().includes(this.state.start.toLowerCase()) &&
                    dest[1].toLowerCase().includes(this.state.endDest.toLowerCase()))
            )
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
                    dest={this.state.start}
                    editfn={this.editStart}
                    placeholder='Choose Starting Point...'/>
                <SearchBar
                    dest={this.state.endDest}
                    editfn={this.editEndDest}
                    placeholder='Choose Destination...'/>
                <input type="text" ref={this.startDateRef} onChange={this.editStartDate}/>
                <input type="text" ref={this.endDateRef} onChange={this.editEndDate}/>
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
