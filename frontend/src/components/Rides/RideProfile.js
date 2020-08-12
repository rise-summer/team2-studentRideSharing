import React, { Component } from 'react';
import CancelRideButton from '../CancelRideButton/CancelRideButton';
import RequestCard from './RequestCard';
import { Segment, Header, Icon, List } from 'semantic-ui-react';
import './RideProfile.css'

class RideProfile extends Component {
    constructor (props) {
        super(props);
        this.state = {
            requests: []
        }
    }

    fetchRequests() {
        //fetch requests of the current ride
        fetch(`/api/requests/${this.props.id}`)
            .then((response) => response.json())
            .then((requests) =>
                this.setState({
                    requests
                })
            )
            .catch((error) => console.log('error', error));
    }

    componentDidMount () {
        this.fetchRequests();
    }

    render() {
        console.log(this.state);
        const {
            startName,
            destName,
            datetime,
            price,
            capacity,
            id,
            handleCancel,
            isCancelled,
        } = this.props;
        const requests = this.state.requests;
        const pendingCount = requests.filter((request) => request.status === 0).length;
        const confirmedCount = requests.filter((request) => request.status === 1).length;
        const dateObject = new Date(datetime);
        const dateString = dateObject.toLocaleDateString('en-US');
        const timeString = dateObject.toLocaleTimeString('en-US');

        return (
            <Segment>
                <Header>
                    <span>
                        {startName}
                        <Icon name="arrow right" />
                        {destName}
                    </span>
                    <span>
                        {!isCancelled && (
                            <CancelRideButton
                                startName={startName}
                                destName={destName}
                                id={id}
                                handleCancel={handleCancel}
                            />
                        )}
                    </span>
                </Header>
                <div className='rideInfo'>
                    <List divided horizontal>
                        <List.Item>{dateString}</List.Item>
                        <List.Item>{timeString}</List.Item>
                        <List.Item>Seats: {capacity}</List.Item>
                    </List>
                    <span style={{'padding-left': '5%'}}>${price}</span>
                </div>
                <div>
                    <div>{pendingCount} Pending {pendingCount > 1 ? "Requests": "Request"}</div>
                    <div>{confirmedCount} Confirmed {confirmedCount > 1 ? "Requests": "Request"}</div>
                    <List className='requestCards' divided animated>
                        {requests.map(request =>
                            <RequestCard
                                request={request} onActionButtonClick={ () => this.fetchRequests() }
                        />)}
                    </List>
                </div>
                {/*
                // <Grid columns="equal">
                //     <Grid.Row>
                //         <Grid.Column></Grid.Column>
                //         <Grid.Column></Grid.Column>
                //     </Grid.Row>
                //     <Grid.Row>
                //         <Grid.Column></Grid.Column>
                //         <Grid.Column></Grid.Column>
                //     </Grid.Row>
                // </Grid>*/}
            </Segment>
        );
    }
}
export default RideProfile;
