import React from 'react';
import TimePicker from '../../components/TimePicker/TimePicker';
import NumberPicker from '../../components/NumberPicker/NumberPicker';
import GeoSearch from '../../components/GeoSearch/GeoSearch';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';

// TODO: change so first ride is stored and everything is submitted at the end

class DriverListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startLocation: {},
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
        const { context, place_type, place_name, center } = resp;

        // Parses attribute types from resp.context
        const getObj = (name) => context.find((obj) => obj.id.startsWith(name));

        // Address can show up in various places, below searches all of them
        const displayName =
            resp.address && place_type[0] === 'address'
                ? resp.address + ' ' + resp.text
                : resp.text;
        const address = place_name;

        // If query is a place, place will not be in context
        const city = place_type[0] === 'place' ? resp : getObj('place');
        const zip = getObj('postcode');
        const state = getObj('region');

        this.setState({
            [fieldName]: {
                lng: center[0],
                lat: center[1],
                address: address,
                city: city ? city.text : '',
                state: state ? state.text : '',
                zip: zip ? zip.text : '',
                displayName: displayName || '',
            },
        });
    };

    postData = async () => {
        const {
            startLocation,
            endLocation,
            startDate,
            startTime,
            price,
            capacity,
        } = this.state;
        const userId = '5f31c5e09320783304b40d4e';
        const url = `/api/rides/${userId}`;
        const bodyData = {
            origin: {
                address: startLocation.address,
                city: startLocation.city,
                state: startLocation.state,
                zip: startLocation.zip,
                displayName: startLocation.displayName,
            },
            destination: {
                address: endLocation.address,
                city: endLocation.city,
                state: endLocation.state,
                zip: endLocation.zip,
                displayName: endLocation.displayName,
            },
            originCoords: {
                type: 'Point',
                coordinates: [startLocation.lng, startLocation.lat],
            },
            destCoords: {
                type: 'Point',
                coordinates: [endLocation.lng, endLocation.lat],
            },
            time: new Date(startDate + startTime), //year, month (0 to 11), date, hours, minutes
            price: price,
            capacity: capacity,
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
                        types="postcode,district,locality,neighborhood,address,poi"
                    />
                    <GeoSearch
                        handleChange={this.handleGeoSubmit}
                        placeholder="Where to?"
                        name="endLocation"
                        types="postcode,district,locality,neighborhood,address,poi"
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
