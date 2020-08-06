import React, { Component } from 'react';
import './RequestRide.css';
import { Modal, Button } from 'semantic-ui-react';

class RequestRide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            setOpen: false,
        }
    }

    render() {
        return (
            <Modal
                trigger={<Button>Request Ride</Button>}
                header='Request a Ride'
                content='Ride Request Modal Component'
                actions={['Cancel', { key: 'send', content: 'Send Ride Request', positive: true }]}
            />
        );
    }
}

export default RequestRide;
