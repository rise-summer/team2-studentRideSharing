import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import TimePicker from '../components/TimePicker/TimePicker';
import NumberPicker from '../components/NumberPicker/NumberPicker';
import GeoSearch from '../components/GeoSearch/GeoSearch';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';

// TODO: change so first ride is stored and everything is submitted at the end

class DriverListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startLocation: '',
            endLocation: {},
            startDate: '',
            startTime: '',
            price: '',
            capacity: '',
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

    handleGeoSubmit = (resp, fieldName) => {
        console.log(resp);
        const mappedContext = resp.context.map((item) => {
            return {
                name: item.id.split('.')[0],
                text: item.text,
            };
        });
        const getObj = (name) => mappedContext.find((obj) => obj.name === name);
        console.log(mappedContext);
        this.setState({
            [fieldName]: {
                lng: resp.center[0],
                lat: resp.center[1],
                address: resp.address || '',
                city: getObj('place').text || '',
                state: getObj('region').text || '',
                zip: getObj('postcode').text || '',
            },
        });
    };

    postData = async () => {
        const userId = 'abc';
        const url = `/api/rides/${userId}`;
        const bodyData = {
            origin: {
                address: '4000 S Rose Ave',
                city: 'Oxnard',
                state: 'CA',
                zip: 93033,
                school: 'Oxnard College',
                // add "Display name"
            },
            destination: {
                address: 'Miramar St',
                city: 'La Jolla',
                state: 'CA',
                zip: 92037,
            },
            originCoords: {
                type: 'Point',
                coordinates: [
                    this.state.startLocation.lng,
                    this.state.startLocation.lat,
                ],
            },
            destCoords: {
                type: 'Point',
                coordinates: [
                    this.state.endLocation.lng,
                    this.state.endLocation.lat,
                ],
            },
            time: new Date(this.state.startDate + this.state.startTime), //year, month (0 to 11), date, hours, minutes
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

    handleSubmit = (event) => {
        event.preventDefault();
        const isRoundTrip = this.state.isRoundTrip;
        // const nextStartLocation = isRoundTrip ? this.state.endLocation : '';
        // const nextEndLocation = isRoundTrip ? this.state.startLocation : '';

        if (this.state.errorMessage === '') {
            this.postData();
            // Do I need async/await here? to avoid setting state prematurely
            console.log('test');
            this.setState({
                startLocation: {},
                endLocation: {},
                startDate: '',
                startTime: '',
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
                    <GeoSearch
                        handleChange={this.handleGeoSubmit}
                        placeholder="Where from?"
                        name="startLocation"
                    />
                    <GeoSearch
                        handleChange={this.handleGeoSubmit}
                        placeholder="Where to?"
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
                        required
                    />
                    <br />
                    {/* Not supported in safari, might change to module */}
                    <label>
                        Earliest start time
                        <TimePicker
                            name="startTime"
                            value={this.state.startTime}
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
