import React, { Component } from 'react';
import { List, Button, Icon } from 'semantic-ui-react';
import './RequestItem.css';

class RequestItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: {},
            requester: {
                lastName: '',
            },
            driver: {
                lastName: '',
            },
            ride: {},
            errorMessage: '',
            timeLeft: '',
            intervalID: 0,
            rideTime: '',
            lineString: [],
            optimalRoute: [],
        };
    }

    calculateTimeLeft() {
        //update timeLeft every second
        const intervalID = setInterval(() => {
            let difference =
                new Date(this.props.request.expirationTime) - new Date();
            if (difference <= 0) {
                //request is expired
                this.props.parentRefetch(); //data fetching function from the parent component
            }
            let timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
            this.setState({
                timeLeft: timeLeft,
            });
        }, 1000);
        this.setState({ intervalID: intervalID });
    }

    calculateNewRoute = async () => {
        const { request, getRequestRoute } = this.props;
        if (request.status === 0) {
            const newRoute = await getRequestRoute({
                pickup: request.originCoords.coordinates,
                dropoff: request.destCoords.coordinates,
            });
            this.setState(newRoute);
        }
    };

    componentDidMount() {
        const { viewer, request } = this.props;
        if (viewer === 'Requester') {
            //calculate time left from now to request expiration time
            this.calculateTimeLeft();
            //fetch driver's info
            fetch(`/api/users/${request.driverID}`)
                .then((response) => {
                    return response.json();
                })
                .then((driver) => {
                    this.setState({ driver });
                })
                .catch((error) => console.log('error', error));
            //fetch ride info
            // is this redundant? since ride is a prop
            fetch(`/api/rides/${request.driverID}/${request.rideID}`)
                .then((response) => {
                    return response.json();
                })
                .then((ride) => {
                    this.setState({ ride });
                })
                .catch((error) => console.log('error', error));
        } else {
            this.calculateNewRoute();
            //fetch requester info
            fetch(`/api/users/${request.ownerID}`)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((requester) => {
                    this.setState({ requester });
                })
                .catch((error) => console.log('error', error));
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    // componentDidUpdate(prevProps) {

    // }

    handleClick = (event) => {
        const action = event.target.name; //deny or confirm or cancel
        //event.target.name
        //='confirm' - change status from 0 to 1
        //='deny' - change status from 0 to 2
        //='cancel' - change status from 0 to 3
        fetch(`/api/requests/${action}/${this.props.request._id}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (response.ok) {
                    if (this.props.viewer === 'Driver') {
                        this.sendEmailNotificationToRequester(action);
                    }
                    this.props.parentRefetch(); //data fetching function from the parent component
                }
                return response.text();
            })
            .then((result) => this.setState({ errorMessage: result }))
            .catch((error) => console.log('error', error));
    };

    handleMapClick = () => {
        this.props.updateMap(
            this.props.request.status === 0,
            this.state.optimalRoute,
            this.state.lineString
        );
    };

    sendEmailNotificationToRequester(action) {
        const { ride, dateString, timeString } = this.props;
        const { firstName, lastName, email } = this.state.requester;
        const { make, model, color, plate } = ride.car;
        const dynamic_template_data = {
            startLoc: ride.startLoc.displayName,
            endLoc: ride.endLoc.displayName,
            driverFirstName: 'Joe', //TODO: current user's first name
            requesterFirstName: firstName,
            startDate: dateString,
            startTime: timeString,
            contact: '999-999-9999', //TODO: current user's contact info
            //"rideURL": window.location.href,
            siteURL: window.location.origin,
            make: make,
            model: model,
            color: color,
            plate: plate,
        };
        var requestBody = {
            requesterMail: email,
            requesterFirstName: firstName,
            requesterLastName: lastName,
            dynamic_template_data: dynamic_template_data,
        };
        // console.log(requestBody);
        const url = '/api/requests/email/' + action + '/' + ride._id;
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        };
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    }

    render() {
        // Currently, only drivers can view map

        const { requester, driver, ride } = this.state;
        const { request, viewer, isPending } = this.props; //version controls what to display
        const { comment, startLoc, endLoc, status } = request;

        if (viewer === 'Other') {
            //from RideDetails Page
            if (status !== 1) {
                //hide non-confirmed requests
                return null;
            } else {
                //display only name and school
                return (
                    <List.Item>
                        <List.Content className="requester">
                            <div>
                                {requester.firstName} {requester.lastName[0]}.
                            </div>
                            <div className="school">{requester.school}</div>
                        </List.Content>
                    </List.Item>
                );
            }
        } else if (viewer === 'Requester') {
            //from User Profile > 'My Requests' Tab
            const dateObject = new Date(ride.time);
            const dateString = dateObject.toLocaleDateString('en-US');
            const timeString = dateObject.toLocaleTimeString('en-US');

            const { hours, minutes, seconds } = this.state.timeLeft;
            if (isPending && (hours < 0 || minutes < 0 || seconds < 0)) {
                return null; //don't display expired pending request
            }

            return (
                <List.Item>
                    <List.Header>
                        <div>
                            {driver.firstName} {driver.lastName[0]}.
                        </div>
                        <div hidden className="school">
                            {driver.school}
                        </div>
                    </List.Header>
                    <List.Content className="driver">
                        <div>
                            {' '}
                            Pick up: {startLoc} -> Drop off: {endLoc}{' '}
                        </div>
                        <div className="rideInfo">
                            <List divided horizontal>
                                <List.Item>{dateString}</List.Item>
                                <List.Item>{timeString}</List.Item>
                                <List.Item>Seats: {ride.capacity}</List.Item>
                            </List>
                            <span style={{ paddingLeft: '5%' }}>
                                ${ride.price}
                            </span>
                        </div>
                        {isPending && (
                            <div>
                                Time left for driver to confirm: {hours}hrs{' '}
                                {minutes}mins {seconds}s
                            </div>
                        )}
                        <a href={'/ride/' + driver._id + '/' + ride._id}>
                            View Ride
                        </a>
                        {isPending && (
                            <Button name="cancel" onClick={this.handleClick}>
                                Cancel Request
                            </Button>
                        )}
                    </List.Content>
                </List.Item>
            );
        }

        const timeAdded = Math.round(
            (this.state.rideTime - this.props.baseRideTime) / 60
        );

        return (
            <List.Item>
                <List.Header className="requester">
                    <div className="name">
                        {requester.firstName} {requester.lastName[0]}.
                    </div>
                    <div className="school">{requester.school}</div>
                    <span style={{ float: 'right' }}>
                        <Button
                            icon
                            labelPosition="right"
                            size="tiny"
                            onClick={this.handleMapClick}
                        >
                            <Icon name="map marker alternate" />
                            Map View
                        </Button>
                    </span>
                </List.Header>
                <List.Content>
                    <div className="requestInfo">
                        <div>Pick Up: {startLoc}</div>
                        <div>Drop off: {endLoc}</div>
                        {comment && <div>Comment: {comment}</div>}
                        {Boolean(timeAdded) && (
                            <div>
                                {`${
                                    requester.firstName
                                }'s ride would add about ${timeAdded} ${
                                    timeAdded === 1 ? 'minute' : 'minutes'
                                } to your trip`}
                            </div>
                        )}
                    </div>
                    {status === 0 && (
                        <div className="requestActions">
                            <Button
                                name="deny"
                                negative
                                onClick={this.handleClick}
                            >
                                Deny
                            </Button>
                            <Button
                                name="confirm"
                                positive
                                onClick={this.handleClick}
                            >
                                Confirm
                            </Button>
                        </div>
                    )}
                </List.Content>
            </List.Item>
        );
    }
}

export default RequestItem;
