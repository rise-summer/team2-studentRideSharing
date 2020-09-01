import React from 'react';
import GeoSearch from '../GeoSearch/GeoSearch';
import DriverInfo from './DriverInfo';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import createRideSplash from './createRideSplash.png';
import { Grid, Segment, Header, Form, Dropdown } from 'semantic-ui-react';
import './DriverListing.css';

// TODO: change so first ride is stored and everything is submitted at the end

class DriverListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startLocation: {},
            endLocation: {},
            startDate: null,
            startTime: '',
            price: '',
            capacity: '',
            returnStartLocation: {},
            returnEndLocation: {},
            returnStartDate: null,
            returnStartTime: '',
            returnPrice: '',
            returnCapacity: '',
            isRoundtrip: false,
            errorMessage: '',
        };
        this.startDateRef = React.createRef();
    }

    handleGeoChange = (resp, fieldName) => {
        this.setState({
            [fieldName]: resp,
        });
    };

    postData = async (data) => {
        const {
            startLocation,
            endLocation,
            startDate,
            startTime,
            price,
            capacity,
        } = data;
        const t = startTime.split(':');
        startDate.setHours(t[0]);
        startDate.setMinutes(t[1]);

        const url = `/api/rides/${this.props.uid}`;
        const bodyData = {
            origin: startLocation,
            destination: endLocation,
            originCoords: {
                type: 'Point',
                coordinates: [startLocation.lng, startLocation.lat],
            },
            destCoords: {
                type: 'Point',
                coordinates: [endLocation.lng, endLocation.lat],
            },
            time: startDate, //year, month (0 to 11), date, hours, minutes
            price: price,
            capacity: capacity,
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

    handleChange = (event, { name, value }) => {
        this.setState({ [name]: value });
    };

    handleRoundtripChange = (event, { value }) => {
        this.setState({ isRoundtrip: value === 'Roundtrip' });
    };

    handleSubmit = (event) => {
        // TODO: Add more validation (including minDate/maxDate)
        // TODO: Add confirmation and reset state
        event.preventDefault();
        if (this.state.errorMessage === '') {
            this.postData(this.state);
            if (this.state.isRoundtrip) {
                const {
                    returnStartLocation,
                    returnEndLocation,
                    returnStartDate,
                    returnStartTime,
                    returnPrice,
                    returnCapacity,
                } = this.state;
                this.postData({
                    startLocation: returnStartLocation,
                    endLocation: returnEndLocation,
                    startDate: returnStartDate,
                    startTime: returnStartTime,
                    price: returnPrice,
                    capacity: returnCapacity,
                });
            }
        }
    };

    render() {
        const today = new Date();
        // TODO: fix geosearch width, destructure this.state, fix carInfo
        today.setDate(today.getDate() - 1);
        // {!this.props.haveCarInfo ? (
        //     <DriverInfo userId={this.props.userId} />
        // ) : (
        //     console.log('user have car info')
        // )}
        const {
            isRoundtrip,
            startDate,
            startTime,
            price,
            capacity,
            returnStartDate,
            returnStartTime,
            returnPrice,
            returnCapacity,
        } = this.state;
        return (
            <Grid className="listingGrid" style={{ background: `url(${createRideSplash})` }}>
                <Grid.Column
                    className="mainColumn"
                    width={11}
                >
                    <Form onSubmit={this.handleSubmit} autocomplete="off">
                        <Segment
                            style={{
                                padding: '20px 50px',
                            }}
                        >
                            <Header as="h3">Create a Ride</Header>
                            <Dropdown
                                style={{ marginBottom: '1em' }}
                                options={[
                                    { key: 0, text: 'One Way', value: false },
                                    { key: 1, text: 'Roundtrip', value: true },
                                ]}
                                value={isRoundtrip}
                                name="isRoundtrip"
                                onChange={this.handleChange}
                            />
                            <Form.Group widths="equal">
                                <Form.Input fluid>
                                    <GeoSearch
                                        className="geoSearch"
                                        handleChange={this.handleGeoChange}
                                        placeholder="Specific Address"
                                        name="startLocation"
                                        types="postcode,district,locality,neighborhood,address,poi"
                                    />
                                </Form.Input>
                                <Form.Input fluid>
                                    <GeoSearch
                                        className="geoSearch"
                                        handleChange={this.handleGeoChange}
                                        placeholder="Specific Address"
                                        name="endLocation"
                                        types="postcode,district,locality,neighborhood,address,poi"
                                    />
                                </Form.Input>
                                {/* <Form.Input
                                    label="Starting Destination"
                                    placeholder="Specific Address"
                                />
                                <Form.Input
                                    label="Ending Destination"
                                    placeholder="Specific Address"
                                /> */}
                            </Form.Group>
                            <Form.Group>
                                <SemanticDatepicker
                                    label="Departure Date"
                                    onChange={this.handleChange}
                                    value={startDate}
                                    name="startDate"
                                    format="MM/DD/YYYY"
                                    minDate={today}
                                    icon="calendar outline"
                                    iconPosition="left"
                                    pointing="top left"
                                    required
                                />
                                <Form.Input
                                    name="startTime"
                                    value={startTime}
                                    onChange={this.handleChange}
                                    label="Departure Time"
                                    type="time"
                                    icon="clock"
                                    iconPosition="left"
                                    placeholder="00:00 AM"
                                    required
                                />
                                <Form.Input
                                    value={price}
                                    name="price"
                                    onChange={this.handleChange}
                                    label="Price"
                                    icon="dollar"
                                    iconPosition="left"
                                    placeholder="00"
                                    type="number"
                                    min={0}
                                    max={50}
                                    step={1}
                                    required
                                />
                                <Form.Input
                                    value={capacity}
                                    name="capacity"
                                    onChange={this.handleChange}
                                    label="Seats"
                                    placeholder="1"
                                    type="number"
                                    min={1}
                                    max={10}
                                    step={1}
                                    required
                                />
                                {!isRoundtrip && (
                                    <Form.Button
                                        style={{ marginTop: '24px' }}
                                        primary
                                        content="Publish Ride"
                                    />
                                )}
                            </Form.Group>
                        </Segment>
                        {isRoundtrip && (
                            <Segment style={{ padding: '20px 50px' }}>
                                <Header as="h3">Create a Return Ride</Header>
                                <Form.Group widths="equal">
                                    <Form.Input fluid>
                                        <GeoSearch
                                            className="geoSearch"
                                            handleChange={this.handleGeoChange}
                                            placeholder="Specific Address"
                                            name="returnStartLocation"
                                            types="postcode,district,locality,neighborhood,address,poi"
                                        />
                                    </Form.Input>
                                    <Form.Input fluid>
                                        <GeoSearch
                                            className="geoSearch"
                                            handleChange={this.handleGeoChange}
                                            placeholder="Specific Address"
                                            name="returnEndLocation"
                                            types="postcode,district,locality,neighborhood,address,poi"
                                        />
                                    </Form.Input>
                                </Form.Group>
                                <Form.Group>
                                    <SemanticDatepicker
                                        label="Departure Date"
                                        onChange={this.handleChange}
                                        value={returnStartDate}
                                        name="returnStartDate"
                                        format="MM/DD/YYYY"
                                        minDate={today}
                                        icon="calendar outline"
                                        iconPosition="left"
                                        pointing="top left"
                                        required
                                    />
                                    <Form.Input
                                        name="returnStartTime"
                                        value={returnStartTime}
                                        onChange={this.handleChange}
                                        label="Departure Time"
                                        type="time"
                                        icon="clock"
                                        iconPosition="left"
                                        placeholder="00:00 AM"
                                        required
                                    />
                                    <Form.Input
                                        value={returnPrice}
                                        name="returnPrice"
                                        onChange={this.handleChange}
                                        label="Price"
                                        icon="dollar"
                                        iconPosition="left"
                                        placeholder="00"
                                        type="number"
                                        min={0}
                                        max={50}
                                        step={1}
                                        required
                                    />
                                    <Form.Input
                                        value={returnCapacity}
                                        name="returnCapacity"
                                        onChange={this.handleChange}
                                        label="Seats"
                                        placeholder="1"
                                        type="number"
                                        min={1}
                                        max={10}
                                        step={1}
                                        required
                                    />
                                    <Form.Button
                                        style={{ marginTop: '24px' }}
                                        primary
                                        content="Publish Ride"
                                    />
                                </Form.Group>
                            </Segment>
                        )}
                    </Form>
                </Grid.Column>
                <Grid.Column width={5} />
            </Grid>
        );
    }
}

export default DriverListing;
