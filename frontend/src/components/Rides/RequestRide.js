import React, { Component } from 'react';
import GeoSearch from '../GeoSearch/GeoSearch';
import './RequestRide.css';
import { Modal, Button, Icon, Form } from 'semantic-ui-react';

class RequestRide extends Component {
    constructor(props) {
        super(props);
        this.initialize();
    }

    initialize() {
        const initialState =
        {
            "open": false,
            "openConfirmation": false,
            "ownerID": "5f2f11554bbc5304bcefda01", //TODO: use actual user info
            "origin": "",
            "dest": "",
            "originCoords": {
                "type": "Point",
                "coordinates": []
            },
            "destCoords": {
                "type": "Point",
                "coordinates": []
            },//<longitude>, <latitude>
            "comment": ""
        };

        if (this.state !== undefined) {
            this.setState(initialState);
            this.setState({openConfirmation: true});
        }
        else {
            this.state = initialState;
        }
    };

    setOpen(isOpen) {
        this.setState({open: isOpen});
    }

    setConfirmationOpen(isOpen) {
        this.setState({openConfirmation: isOpen});
    }

    requestRide() {
        const {rideID, ride, driver, dateString, timeString} = this.props;
        console.log(window.location);
        const dynamic_template_data = {
            "startLoc": ride.startLoc.displayName,
            "endLoc": ride.endLoc.displayName,
            "driverFirstName": driver.firstName,
            "requesterFirstName": "Evelyn", //TODO: current user's first name
            "startDate": dateString,
            "startTime": timeString,
            "contact": "999-999-9999", //TODO: current user's contact info
            //"rideURL": window.location.href,
            "requestURL": window.location.origin + "/profile",
            "siteURL": window.location.origin
        };
        var requestBody = {
            "driverMail": driver.email,
            "driverFirstName": driver.firstName,
            "driverLastName":  driver.lastName,
            "dynamic_template_data": dynamic_template_data
        };
        console.log(requestBody);
        const url = "/api/requests/email/" + rideID;
        var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleGeoChange = (resp, fieldName) => {
        this.setState({
            [fieldName]: resp.address,
            [`${fieldName}Coords`]: [resp.lng, resp.lat],
        });
    };

    handleSubmit = (event) => {
        //validate form input
        //post the request to database
        var raw = {
            "ownerID": this.state.ownerID,
            "origin": this.state.origin,
            "destination": this.state.dest,
            "originCoords": {
                "type": "Point",
                "coordinates": this.state.originCoords
            },
            "destCoords": {
                "type": "Point",
                "coordinates": this.state.destCoords
            },//<longitude>, <latitude>
            "comment": this.state.comment
        };
        const url = "/api/requests/" + this.props.rideID;
        var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(raw),
        };

        fetch(url, requestOptions)
            .then(response => {
                if(response.status === 201) {
                    this.initialize();
                    console.log(this.state);
                    // send email notification
                    this.requestRide();
                    return response.json();
                }
                else {
                    throw new Error('Failed to post the request');
                }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    triggerButton() {
        if (this.props.disable === true) {
            return <Button disabled>No Longer Accepting Requests</Button>;
        }
        else {
            return <Button>Request a Ride</Button>;
        }
    }

    render() {
        return (
            <div>
            <Modal
                closeIcon
                as={Form}
                onSubmit={this.handleSubmit}
                trigger={this.triggerButton()}
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
            >
                <Modal.Header>
                <center>
                    Request a Ride
                </center>
                </Modal.Header>
                <Modal.Content>
                    <div className="name padding">{this.props.driver.firstName} {this.props.driver.lastName}</div>
                    <div className="subtitle padding">{this.props.driver.school} </div>
                    <div className="itinerary">
                        <div className="location">{this.props.ride.startLoc.city}, {this.props.ride.startLoc.state}</div>
                        <Icon name="arrow right" />
                        <div className="location">{this.props.ride.endLoc.city}, {this.props.ride.endLoc.state}</div>
                    </div>
                    <div className="subtitle padding">Date: {this.props.dateString}</div>
                    <div className="subtitle padding">Departure Time: {this.props.timeString}</div>
                    <GeoSearch
                        handleChange={this.handleGeoChange}
                        placeholder="Pick Up Location"
                        name="origin"
                        types="address"
                    />
                    <GeoSearch
                        handleChange={this.handleGeoChange}
                        placeholder="Drop Off Location"
                        name="dest"
                        types="address"
                    />
                    <Form.Input value={this.state.comment} name="comment" label="Additional Comments" type="text" onChange={this.handleChange}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setOpen(false)}>
                        Cancel
                    </Button>
                    <Button icon
                        labelPosition='right'
                        type="submit"
                        positive>
                        <Icon name='checkmark' />
                         Send Ride Request
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal
                onClose={() => this.setConfirmationOpen(false)}
                onOpen={() => this.setConfirmationOpen(true)}
                open={this.state.openConfirmation}
            >
                <Modal.Content>
                    <div className="name padding"><center> Your Ride Request has been sent to {this.props.driver.firstName} </center> </div>
                </Modal.Content>
                <Modal.Actions>
                    <center>
                    <div hidden='true'>
                    <Button onClick={() => this.setConfirmationOpen(false)}>
                        Cancel Request
                    </Button>
                    </div>
                    <Button icon
                        labelPosition='right'
                        onClick={() => this.setConfirmationOpen(false)}
                        positive>
                        <Icon name='checkmark' />
                        Okay
                    </Button>
                    </center>
                </Modal.Actions>
            </Modal>
            </div>
        );
    }
}

export default RequestRide;
