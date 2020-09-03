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
            baseRoute: {
                origin: [],
                dest: [],
                waypoints: [],
            },
            //array of points in optimal path
            optimizedBaseRoute: [],
            baseRideTime: '',
            baseLineString: [],
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

    // TODO: revise this function, it has a lot of side effects
    setCurrentOptimizedRoute = async () => {
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
        const baseRoute = {
            origin: originCoords.coordinates,
            dest: destCoords.coordinates,
            waypoints: waypoints,
        };

        this.setState({ baseRoute: baseRoute });
        const response = await this.calcRoute(baseRoute);
        this.setState({
            optimizedBaseRoute: response.optimalRoute,
            baseRideTime: response.rideTime,
            baseLineString: response.lineString,
        });

        // TODO: Find better solution
        return { baseRoute: baseRoute, response: response };
    };

    // Returns optimal path and ride time
    calcRoute = async (route) => {
        const originString = route.origin.join(',') + ';';
        const destString = route.dest.join(',');
        let waypointsString = '';
        let distributionString = '';
        let counter = 1;
        route.waypoints.forEach((waypoint) => {
            waypointsString += `${waypoint.pickup.join(
                ','
            )};${waypoint.dropoff.join(',')};`;
            distributionString += `${counter},${counter + 1};`;
            counter += 2;
        });
        // Remove trailing semicolon
        distributionString = distributionString.slice(
            0,
            distributionString.length - 1
        );

        const coordinates = originString + waypointsString + destString;
        const parameters = {
            distributions: distributionString,
            source: 'first',
            overview: 'full',
            geometries: 'geojson',
            destination: 'last',
            roundtrip: 'false',
            access_token:
                'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrY3dnbmxkbzAyaWQycm5qemVmYzF0NnUifQ.iBcVduGfqvv6KsXReFG7Jg',
        };

        const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?${queryString.stringify(
            parameters
        )}`;
        try {
            const response = await fetch(url);
            const responseJson = await response.json();
            return {
                optimalRoute: responseJson.waypoints.map(
                    (waypoint) => waypoint.location
                ),
                rideTime: responseJson.trips[0].duration,
                lineString: responseJson.trips[0].geometry.coordinates,
            };
        } catch (error) {
            console.log(error);
        }
    };

    getCurrentBaseRoute = async () => {
        const { baseRoute } = this.state;
        if (baseRoute.origin.length > 0 && baseRoute.dest.length > 0)
            return baseRoute;
        else {
            const response = await this.setCurrentOptimizedRoute();
            return response.baseRoute;
        }
    };

    getRequestRoute = async (newWaypoint) => {
        const route = await this.getCurrentBaseRoute();
        route.waypoints.push(newWaypoint);
        const routeOptimization = await this.calcRoute(route, console.log);
        return routeOptimization;

        //TODO: Add so that confirmed rides still have base route in state
    };

    updateMap = async (isNewRoute, newOptimalRoute, newLineString) => {
        const { setWaypoints, setLineString } = this.props;
        if (isNewRoute) {
            setWaypoints(newOptimalRoute);
            setLineString(newLineString);
        } else {
            const { baseRoute } = this.state;
            if (
                baseRoute.origin.length > 0 &&
                baseRoute.dest.length > 0 &&
                this.state.baseLineString.length > 0
            ) {
                setLineString(this.state.baseLineString);
                setWaypoints(this.state.optimizedBaseRoute);
            } else {
                const res = await this.setCurrentOptimizedRoute();
                setLineString(res.response.lineString);
                setWaypoints(res.response.optimalRoute);
            }
        }
    };

    componentDidMount() {
        this.fetchRequests();
    }

    render() {
        const { ride, handleError, isActive } = this.props;
        const { requests, baseRideTime } = this.state;
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

        const confirmedRequestList = confirmedRequests.map((request, index) => (
            <RequestItem
                key={index}
                viewer="Driver"
                request={request}
                ride={ride}
                dateString={dateString}
                timeString={timeString}
                parentRefetch={() => this.fetchRequests()}
                getRequestRoute={this.getRequestRoute}
                updateMap={this.updateMap}
            />
        ));

        const pendingRequestList = pendingRequests.map((request, index) => (
            <RequestItem
                key={index}
                viewer="Driver"
                request={request}
                ride={ride}
                dateString={dateString}
                timeString={timeString}
                parentRefetch={() => this.fetchRequests()}
                baseRideTime={baseRideTime}
                getRequestRoute={this.getRequestRoute}
                updateMap={this.updateMap}
            />
        ));
        return (
            <div className="ride-profile">
                <Header as="h5" className="ride-header">
                    <span>
                        {/* Click header to view ride */}
                        <a className="ride-link" href={'/ride/' + driverID + '/' + _id}>
                            <div className="large-bold-font">{startLoc.city}, {startLoc.state}
                            {/* <br/> */}
                            {/* <span className="lighter-font">Starting Location</span> */}
                                <Icon id="arrow" size="large" name="long arrow alternate right" />
                            {endLoc.city}, {endLoc.state}</div>
                            {/* <br/> */}
                            {/* <span className="lighter-font">Ending Location</span> */}

                        </a>
                    </span>
                    {isActive && (
                        <span className="header-span" style={{ float: "right", marginTop: "2%", marginBottom: "2%" }}>
                            <CancelRideButton
                                startName={startLoc.city}
                                destName={endLoc.city}
                                id={_id}
                                handleError={handleError}
                                driverID={driverID}
                            />
                        </span>    
                    )}
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
                            <List className="requestsList" divided verticalAlign="middle">
                                {confirmedRequestList}
                            </List>
                        </div>
                    )}
                    {
                        /*display the divider only when there are both confirmed and pending requests*/
                        confirmedCount > 0 && pendingCount > 0 && <Divider />
                    }
                    {pendingCount > 0 && (
                        <div className="pendingRequests">
                            <div>
                                {pendingCount} Pending{' '}
                                {pendingCount > 1 ? 'Requests' : 'Request'}
                            </div>
                            <List className="requestsList" divided verticalAlign="middle">
                                {pendingRequestList}
                            </List>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default RideProfile;
