import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import TimePicker from '../components/TimePicker/TimePicker';
import NumberPicker from '../components/NumberPicker/NumberPicker';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';

class DriverListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startLocation: '',
            endLocation: '',
            startDate: '',
            firstStartTime: '',
            lastStartTime: '',
            price: undefined,
            capacity: undefined,
            isRoundTrip: false,
            errorMessage: '',
            step: 1,
        };
        this.startDateRef = React.createRef();
    }

    componentDidMount() {
        new Pikaday({
            field: this.startDateRef.current,
            onSelect: this.editStartDate,
        });
    }

    editStartDate = (d) => {
        var date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({ startDate: date });
    };

    handleChange = (event) => {
        const name = event.target.name;
        const value =
            name === 'isRoundTrip' ? event.target.checked : event.target.value;
        this.setState({ [name]: value });
    };

    // TODO: Add verification to make sure all fields are filled
    handleSubmit = (event) => {
        event.preventDefault();
        const isRoundTrip = this.state.isRoundTrip;
        const nextStartLocation = isRoundTrip ? this.state.endLocation : '';
        const nextEndLocation = isRoundTrip ? this.state.startLocation : '';

        this.setState({
            startLocation: nextStartLocation,
            endLocation: nextEndLocation,
            startDate: '',
            firstStartTime: '',
            lastStartTime: '',
            price: '',
            capacity: '',
            errorMessage: '',
            isRoundTrip: false,
            step: isRoundTrip ? 2 : 1,
        });
    };

    render() {
        return (
            <div>
                {this.state.step === 1 ? (
                    <h1>Create a ride</h1>
                ) : (
                    <h1>Create a return ride</h1>
                )}
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    {/* Replace with location picker*/}
                    <SearchBar
                        text={this.state.startLocation}
                        editfn={this.handleChange}
                        placeholder="Start location"
                        name="startLocation"
                    />
                    {/* Replace with location picker */}
                    <SearchBar
                        text={this.state.endLocation}
                        editfn={this.handleChange}
                        placeholder="End location"
                        name="endLocation"
                    />
                    <input
                        className="date-picker-box"
                        type="text"
                        ref={this.startDateRef}
                        onChange={this.editStartDate}
                        value={this.state.startDate}
                        placeholder="Start date"
                        name="startDate"
                    />
                    <br />
                    <label>
                        Earliest start time
                        <TimePicker
                            name="firstStartTime"
                            value={this.state.firstStartTime}
                            editfn={this.handleChange}
                        />
                    </label>
                    <label>
                        Latest start time
                        <TimePicker
                            name="lastStartTime"
                            value={this.state.lastStartTime}
                            editfn={this.handleChange}
                        />
                    </label>
                    <NumberPicker
                        min={0}
                        max={100}
                        step={0.01}
                        value={this.state.price}
                        name="price"
                        placeholder="Price"
                        editfn={this.handleChange}
                    />
                    <NumberPicker
                        min={1}
                        max={10}
                        step={1}
                        value={this.state.capacity}
                        name="capacity"
                        placeholder="Capacity"
                        editfn={this.handleChange}
                    />
                    <label>
                        Round Trip
                        <input
                            type="checkbox"
                            name="isRoundTrip"
                            onChange={this.handleChange}
                            checked={
                                this.state.isRoundTrip || this.state.step === 2
                            }
                            disabled={this.state.step === 2}
                        />
                    </label>
                    <br />
                    <input
                        type="submit"
                        value={
                            this.state.isRoundTrip && this.state.step === 1
                                ? 'Continue'
                                : 'Submit'
                        }
                    />
                </form>
            </div>
        );
    }
}

export default DriverListing;
