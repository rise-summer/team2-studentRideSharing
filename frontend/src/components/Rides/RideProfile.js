import React, { Component } from 'react';
import CancelRideButton from '../CancelRideButton/CancelRideButton';
import RequestItem from '../Requests/RequestItem';
import { Segment, Header, Icon, List, Divider } from 'semantic-ui-react';
import './RideProfile.css';

class RideProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
        };
    }

    fetchRequests() {
        //fetch requests of the current ride
        fetch(`/api/requests?ride=${this.props.ride._id}`)
            .then((response) => response.json())
            .then((requests) =>
                this.setState({
                    requests,
                })
            )
            .catch((error) => console.log('error', error));
    }

    componentDidMount() {
        this.fetchRequests();
    }

    handleMapRequest = () => {
        const { originCoords, destCoords } = this.props.ride;
        this.props.setMapCoords({
            origin: originCoords.coordinates,
            destination: destCoords.coordinates,
        });
    }
    
    render() {
        const {ride, handleError, isActive} = this.props;
        const {requests} = this.state;
        const {
            startLoc,
            endLoc,
            time,
            price,
            capacity,
            _id,
            driverID
        } = ride;
        const pendingRequests = requests.filter((request) => request.status === 0);
        const confirmedRequests = requests.filter((request) => request.status === 1);
        const pendingCount = pendingRequests.length;
        const confirmedCount = confirmedRequests.length;
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
                    <span style={{ float: 'right' }}>
                        <a href={'/ride/' + driverID + '/' + _id}>View Ride</a>
                        <span>
                            {isActive && (
                                <CancelRideButton
                                    startName={startLoc.city}
                                    destName={endLoc.city}
                                    id={_id}
                                    handleError={handleError}
                                    driverID={driverID}
                                />
                            )}
                        </span>
                    </span>
                </Header>
                <div className="rideInfo">
                    <List divided horizontal>
                        <List.Item>{dateString}</List.Item>
                        <List.Item>{timeString}</List.Item>
                        <List.Item>Seats: {capacity}</List.Item>
                    </List>
                    <span style={{ paddingLeft: '5%' }}>${price}</span>
                </div>
                <div className='requestsList'>
                {
                    confirmedCount > 0 &&
                    <div className='confirmedRiders'>
                        <div>{confirmedCount} Confirmed {confirmedCount > 1 ? "Riders": "Rider"}</div>
                        <List className='requestsList' divided animated>
                            {confirmedRequests.map((request, index) =>
                                <RequestItem
                                    key={index}
                                    viewer="Driver"
                                    request={request} ride={ride} dateString={dateString} timeString={timeString}
                                    parentRefetch={ () => this.fetchRequests() }
                                    handleMapRequest={this.handleMapRequest}
                                    setWaypoints={this.props.setWaypoints}
                            />)}
                        </List>
                    </div>
                }
                {
                    /*display the divder only when there are both confirmed and pending requests*/
                    confirmedCount > 0 && pendingCount > 0 &&
                    <Divider />
                }
                {
                    pendingCount > 0 &&
                    <div className='pendingRequests'>
                        <div>{pendingCount} Pending {pendingCount > 1 ? "Requests": "Request"}</div>
                        <List className='requestsList' divided animated>
                            {pendingRequests.map((request, index) =>
                                <RequestItem
                                    key={index}
                                    viewer="Driver"
                                    request={request} ride={ride} dateString={dateString} timeString={timeString}
                                    parentRefetch={ () => this.fetchRequests() }
                                    handleMapRequest={this.handleMapRequest}
                                    setWaypoints={this.props.setWaypoints}
                            />)}
                        </List>
                    </div>
                }
                </div>
            </Segment>
        );
    }
}
export default RideProfile;
