import React, { Component } from 'react';
import CancelRideButton from '../CancelRideButton/CancelRideButton';
import RequestItem from '../Requests/RequestItem';
import { Segment, Header, Icon, List, Divider } from 'semantic-ui-react';
import queryString from 'query-string';
import './RideProfile.css';

class RideProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            //collection of points in non-optimal path, with pickups and dropoffs labelled
            currentRoute: {
                origin: [],
                dest: [],
                waypoints: [],
            },
            //array of points in optimal path
            optimalRoute: [],
            rideTime: '',
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

    setCurrentOptimizedRoute = () => {
        const { requests } = this.state;
        const confirmedRequests = requests.filter(
            (request) => request.status === 1
        );

        // Each waypoint has pickup and dropoff coordinate labelled to ensure proper optimization
        const waypoints = confirmedRequests.map((request) => {
            return {
                pickup: request.originCoords.coordinates,
                dropoff: request.destCoords.coordinates,
            };
        });
        const { originCoords, destCoords } = this.props.ride;
        const currentRoute = {
            origin: originCoords.coordinates,
            dest: destCoords.coordinates,
            waypoints: waypoints,
        };

        this.setState({ currentRoute: currentRoute });
        this.calcRoute(currentRoute);
    }

    // Returns optimal path and ride time
    calcRoute = (route) => {
        const originString = route.origin.join(',') + ';';
        const destString = route.dest.join(',');
        let waypointsString = '';
        route.waypoints.forEach((waypoint) => {
            waypointsString += `${waypoint.pickup.join(',')};${waypoint.pickup.join(',')};`;
        });
        const coordinates = originString + waypointsString + destString;
        console.log(coordinates);
        const parameters = {
            distributions: '',
            source: 'first',
            // overview: 'false',
            destination: 'last',
            access_token:
                'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrY3dnbmxkbzAyaWQycm5qemVmYzF0NnUifQ.iBcVduGfqvv6KsXReFG7Jg',
        };

        const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?${queryString.stringify(parameters)}`;

        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
            })
            .catch((error) => console.log(error));
    }

    componentDidUpdate(prevProps, prevState) {
        const { requests } = this.state;
        if (prevState.requests !== requests) {
            this.setCurrentOptimizedRoute();
        }
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
    };

    render() {
        const { ride, handleError, isActive } = this.props;
        const { requests } = this.state;
        const { startLoc, endLoc, time, price, capacity, _id, driverID } = ride;
        const pendingRequests = requests.filter(
            (request) => request.status === 0
        );
        const confirmedRequests = requests.filter(
            (request) => request.status === 1
        );
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
                <div className="requestsList">
                    {confirmedCount > 0 && (
                        <div className="confirmedRiders">
                            <div>
                                {confirmedCount} Confirmed{' '}
                                {confirmedCount > 1 ? 'Riders' : 'Rider'}
                            </div>
                            <List className="requestsList" divided animated>
                                {confirmedRequests.map((request, index) => (
                                    <RequestItem
                                        key={index}
                                        viewer="Driver"
                                        request={request}
                                        ride={ride}
                                        dateString={dateString}
                                        timeString={timeString}
                                        parentRefetch={() =>
                                            this.fetchRequests()
                                        }
                                        handleMapRequest={this.handleMapRequest}
                                        setWaypoints={this.props.setWaypoints}
                                    />
                                ))}
                            </List>
                        </div>
                    )}
                    {
                        /*display the divder only when there are both confirmed and pending requests*/
                        confirmedCount > 0 && pendingCount > 0 && <Divider />
                    }
                    {pendingCount > 0 && (
                        <div className="pendingRequests">
                            <div>
                                {pendingCount} Pending{' '}
                                {pendingCount > 1 ? 'Requests' : 'Request'}
                            </div>
                            <List className="requestsList" divided animated>
                                {pendingRequests.map((request, index) => (
                                    <RequestItem
                                        key={index}
                                        viewer="Driver"
                                        request={request}
                                        ride={ride}
                                        dateString={dateString}
                                        timeString={timeString}
                                        parentRefetch={() =>
                                            this.fetchRequests()
                                        }
                                        handleMapRequest={this.handleMapRequest}
                                        setWaypoints={this.props.setWaypoints}
                                    />
                                ))}
                            </List>
                        </div>
                    )}
                </div>
            </Segment>
        );
    }
}
export default RideProfile;
