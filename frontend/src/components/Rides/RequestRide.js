import React, { Component } from 'react';
import { connect } from 'react-redux';
import GeoSearch from '../GeoSearch/GeoSearch';
import './RequestRide.css';
import { Modal, Button, Icon, Form } from 'semantic-ui-react';

/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    uid: state.uid,//current user info
});

const initialState = {
    "open": false,
    "openConfirmation": false,
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

class RequestRide extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    clearFormAndConfirm() {
        this.setState(initialState);
        this.setState({openConfirmation: true});
    }

    setOpen(isOpen) {
        this.setState({open: isOpen});
    }

    setConfirmationOpen(isOpen) {
        this.setState({openConfirmation: isOpen});
    }

    requestRide() {
        const {rideID, ride, driver, dateString, timeString} = this.props;
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
            "ownerID": this.props.uid,
            "driverID": this.props.driver._id,
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
        const postRequestUrl = "/api/requests/" + this.props.rideID;
        var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(raw),
        };

        fetch(postRequestUrl, requestOptions)
            .then(response => {
                if(response.status === 201) {
                    this.clearFormAndConfirm();
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
            return <Button basic color="orange"disabled>No Longer Accepting Requests</Button>;
        }
        else {
            return <Button primary>Request a Ride</Button>;
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
                size="tiny"
                dimmer="blurring"
            >
                <Modal.Header className="modal-header">
                Request A Ride
                </Modal.Header>
                <Modal.Content>
                        <h3 className="no-margin">
                            {this.props.driver.firstName} {this.props.driver.lastName} 
                            <span className="subtitle padding-left">{this.props.driver.school} </span>
                        </h3>
                    
                    <div className="itinerary">
                        <h5 className="location">{this.props.ride.startLoc.city}, {this.props.ride.startLoc.state}</h5>
                        <Icon className="ride-request-arrow" name="long arrow alternate right" size="large"/>
                        <h5 className="location">{this.props.ride.endLoc.city}, {this.props.ride.endLoc.state}</h5>
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
                    <span>
                        This information will be sent to the requested driver. They will have 24 hours to repond
                        to your request via your contact perferences.
                    </span>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="orange" onClick={() => this.setOpen(false)}>
                        Cancel
                    </Button>
                    <Button primary icon
                        labelPosition="right"
                        type="submit">
                        <Icon name="checkmark" />
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
                    <div hidden="true">
                    <Button onClick={() => this.setConfirmationOpen(false)}>
                        Cancel Request
                    </Button>
                    </div>
                    <Button icon
                        labelPosition="right"
                        onClick={() => this.setConfirmationOpen(false)}
                        primary>
                        <Icon name="checkmark" />
                        Okay
                    </Button>
                    </center>
                </Modal.Actions>
            </Modal>
            </div>
        );
    }
}

export default connect(mapStateToProps)(RequestRide);
