import React, { Component } from 'react';
import './RequestRide.css';
import { Modal, Button } from 'semantic-ui-react';

class RequestRide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    setOpen(isOpen) {
        this.setState({open: isOpen});
    }

    requestRide() {
        const rideID = this.props.rideID;
        var raw = {
            "driverMail": this.props.driver.email,
            "driverFirstName": this.props.driver.firstName,
            "driverLastName":  this.props.driver.lastName,
            "requesterFirstName": "Evelyn", //TODO: current user's first name
            "startLoc": this.props.ride.startLoc.display,
            "endLoc": this.props.ride.endLoc.display
        };
        console.log(raw);
        const url = "/api/requests/email/" + rideID;
        var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(raw),
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };

    render() {
        return (
            <Modal
                trigger={<Button>Request Ride</Button>}
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
            >
                <Modal.Header>
                    Request a Ride
                </Modal.Header>
                <Modal.Content>
                    Ride Request Modal Component
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        content='Send Ride Request'
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            this.requestRide();
                        }}
                        positive />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default RequestRide;
