import React, { Component } from 'react';
import CancelRideButton from '../CancelRideButton/CancelRideButton';
import RequestItem from './RequestItem';
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
        fetch(`/api/requests/${this.props.ride._id}`)
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
        console.log(this.props.ride);
        console.log(this.state);
        const {ride, handleCancel, isCancelled} = this.props;
        const {
            startLoc,
            endLoc,
            time,
            price,
            capacity,
            _id,
            driverID
        } = ride;
        const requests = this.state.requests;
        const pendingCount = requests.filter((request) => request.status === 0).length;
        const confirmedCount = requests.filter((request) => request.status === 1).length;
        const dateObject = new Date(time);
        const dateString = dateObject.toLocaleDateString('en-US');
        const timeString = dateObject.toLocaleTimeString('en-US');

        return (
            <Segment>
                <Header>
                    <span>
                        {startLoc.city}, {startLoc.state}
                        <Icon name="arrow right" />
                        {endLoc.city}, {endLoc.state}
                    </span>
                    <span style={{float: "right"}}>
                        <a href={"/ride/"+driverID+"/"+_id} >View Ride</a>
                        <span>
                            {!isCancelled && (
                                <CancelRideButton
                                    startName={startLoc.city}
                                    destName={endLoc.city}
                                    id={_id}
                                    handleCancel={handleCancel}
                                />
                            )}
                        </span>
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
                    <List className='requestsList' divided animated>
                        {requests.map(request =>
                            <RequestItem
                                request={request} ride={ride} dateString={dateString} timeString={timeString} onActionButtonClick={ () => this.fetchRequests() }
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
