import React, { Component } from 'react';
import { List, Button, Icon } from 'semantic-ui-react';
import queryString from 'query-string';
import './RequestItem.css';

class RequestItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: {},
            requester: {
                lastName: '',
            },
            errorMessage: '',
        };
    }
    componentDidMount() {
        //fetch requester info
        fetch(`/api/users/${this.props.request.ownerID}`)
            .then((response) => {
                return response.json();
            })
            .then((requester) => {
                this.setState({ requester });
            })
            .catch((error) => console.log('error', error));

        this.calculateAddedTime();
    }

    handleClick = (event) => {
        const action = event.target.name; //deny or confirm
        //event.target.name
        //='deny' - change status from 0 to 2
        //='confirm' - change status from 0 to 1
        fetch(`/api/requests/${action}/${this.props.request._id}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (response.ok) {
                    this.sendEmailNotificationToRequester(action);
                    this.props.onActionButtonClick(); //data fetching function from the parent component RideProfile
                }
                return response.text();
            })
            .then((result) => this.setState({ errorMessage: result }))
            .catch((error) => console.log('error', error));
    };

    handleMapClick = () => {
        this.props.handleMapRequest();
        const { originCoords, destCoords } = this.props.request;
        this.props.setWaypoints([
            originCoords.coordinates,
            destCoords.coordinates,
        ]);
    };

    /* TODO: Gather all coordinates together: origin, dest, and any waypoints
        then plug them into this function
        if possible, have a way to label them as pickup and dropoff
        store all confirmed waypoints in one place
        then add in the new waypoint into this method
        store in state somewhere
    */
    calculateAddedTime = () => {
        const coordinates = '12,12;12.01,12.01';
        const parameters = {
            // distributions: '',
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
        console.log(requestBody);
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
        const { firstName, lastName, school } = this.state.requester;
        const { request, version } = this.props; //version controls what to display
        const { comment, startLoc, endLoc, status } = request;
        if (version === 'RideDetailsPage') {
            if (status !== 1) {
                //hide non-confirmed requests
                return null;
            } else {
                //display only name and school
                return (
                    <List.Item>
                        <List.Content className="requester">
                            <div>
                                {firstName} {lastName[0]}.
                            </div>
                            <div className="school">{school}</div>
                        </List.Content>
                    </List.Item>
                );
            }
        }
        return (
            <List.Item>
                <List.Header className="requester">
                    <div className="name">
                        {firstName} {lastName[0]}.
                    </div>
                    <div className="school">{school}</div>
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
                        <div>{`${firstName}'s ride would add about ${14} minutes to your trip`}</div>
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
