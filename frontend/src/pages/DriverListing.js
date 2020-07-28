import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import TimePicker from '../components/TimePicker/TimePicker';
import NumberPicker from '../components/NumberPicker/NumberPicker';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';

// TODO: remove lastStartTime
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
            minDate: new Date(),
        });
    }

    editStartDate = (d) => {
        var date = moment(d).format('MM/DD/YYYY') + ' ';
        this.setState({ startDate: date });
    };

    postData = async () => {
        const userId = 'abc';
        const url = `/api/rides/${userId}`;
        const testBodyData = {
            startLoc: {
                address: '69 Division Ave',
                city: 'Victorville',
                state: 'CA',
                zip: 92392,
            },
            endLoc: {
                city: 'Los Angeles',
                state: 'CA',
                zip: 90095,
                school: 'UCLA',
            }, //school is optional
            originCoords: {
                type: 'Point',
                coordinates: [-119.158323, 34.177169],
            },
            destCoords: [-117.274471, 32.832215],
            time: new Date(2020, 6, 23, 13, 0), //year, month (0 to 11), date, hours, minutes
            price: 20.0,
            capacity: 3,
            car: {
                model: 'Toyota',
                make: 'Camry',
                color: 'White',
                plate: '7AVF369',
            },
        };
        const bodyData = {
            origin: {
                address: '4000 S Rose Ave',
                city: 'Oxnard',
                state: 'CA',
                zip: 93033,
                school: 'Oxnard College',
            },
            destination: {
                address: 'Miramar St',
                city: 'La Jolla',
                state: 'CA',
                zip: 92037,
            },
            originCoords: {
                type: 'Point',
                coordinates: [-119.159392, 34.164958],
            },
            destCoords: {
                type: 'Point',
                coordinates: [-117.221505, 32.873788],
            },
            time: new Date(this.state.startDate + this.state.firstStartTime), //year, month (0 to 11), date, hours, minutes
            price: this.state.price,
            capacity: this.state.capacity,
            car: {
                model: 'Toyota',
                make: 'Camry',
                color: 'White',
                plate: '7AVF369',
            },
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleChange = (event) => {
        const name = event.target.name;
        const value =
            name === 'isRoundTrip' ? event.target.checked : event.target.value;
        this.setState({ [name]: value });
    };

    // Handles custom validation. Some validation is done in the HTML
    handleValidation = (event) => {
        const time1 = Date.parse('01/01/2000' + this.state.firstStartTime);
        const time2 = Date.parse('01/01/2000' + this.state.lastStartTime);
        if (time2 < time1) {
            console.log('this');
            this.setState({
                errorMessage:
                    'Earliest start time must come before latest start time',
            });
            console.log('state set', this.state.errorMessage);
        } else {
            this.setState({ errorMessage: '' });
        }
        console.log('end of validation', this.state.errorMessage);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const isRoundTrip = this.state.isRoundTrip;
        const nextStartLocation = isRoundTrip ? this.state.endLocation : '';
        const nextEndLocation = isRoundTrip ? this.state.startLocation : '';

        // this.handleValidation();

        if (this.state.errorMessage === '') {
            this.postData();
            this.setState({
                startLocation: nextStartLocation,
                endLocation: nextEndLocation,
                startDate: '',
                firstStartTime: '',
                lastStartTime: '',
                price: '',
                capacity: '',
                isRoundTrip: false,
                step: isRoundTrip ? 2 : 1,
            });
        }
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
                        required
                    />
                    {/* Replace with location picker */}
                    <SearchBar
                        text={this.state.endLocation}
                        editfn={this.handleChange}
                        placeholder="End location"
                        name="endLocation"
                        required
                    />
                    <input
                        className="date-picker-box"
                        type="text"
                        ref={this.startDateRef}
                        onChange={this.editStartDate}
                        value={this.state.startDate}
                        placeholder="Start date"
                        name="startDate"
                        required
                    />
                    <br />
                    {/* Not supported in safari, might change to module */}
                    <label>
                        Earliest start time
                        <TimePicker
                            name="firstStartTime"
                            value={this.state.firstStartTime}
                            editfn={this.handleChange}
                            required
                        />
                    </label>
                    <label>
                        Latest start time
                        <TimePicker
                            name="lastStartTime"
                            value={this.state.lastStartTime}
                            editfn={this.handleChange}
                            required
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
                        required
                    />
                    <NumberPicker
                        min={1}
                        max={10}
                        step={1}
                        value={this.state.capacity}
                        name="capacity"
                        placeholder="Capacity"
                        editfn={this.handleChange}
                        required
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
                <h2>{this.state.errorMessage}</h2>
            </div>
        );
    }
}

export default DriverListing;
