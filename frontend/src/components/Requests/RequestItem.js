import React, { Component } from 'react';
import { List, Button, Icon, Image, Header, Label } from 'semantic-ui-react';
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
            ride: {
                startLoc: {},
                endLoc: {}
            },
            errorMessage: '',
            timeLeft: '',
            intervalID: 0,
            rideTime: '',
            lineString: [],
            optimalRoute: [],
            isCopied: false
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
            // is this redundant? since ride is a prop - we don't have ride in the prop when the viewer is requester
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

    copyToClipboard = (event) => {
        const { ride } = this.state;
        //TODO: make the url correct
        const url =  window.location.hostname + '/ride/' + ride.driverID + '/' + ride._id;
        window.navigator.clipboard.writeText(url).then(() => {
            this.setState({isCopied: true});
        }).catch(err => {
            console.log('Something went wrong', err);
            alert("Failed to copy the url to the clipboard. You might manually copy that and share the link!");
        });
    }

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
        const { comment, status } = request;

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
            //from User Profile > 'Requests Sent' Tab
            const { startLoc, endLoc } = ride;

            const dateObject = new Date(ride.time);
            const dateString = dateObject.toLocaleDateString('en-US');
            const timeString = dateObject.toLocaleTimeString('en-US');

            const { hours, minutes, seconds } = this.state.timeLeft;
            if (isPending && (hours < 0 || minutes < 0 || seconds < 0)) {
                return null; //don't display expired pending request
            }

            return (
                <List.Item className="profile-requested-ride-li">
                    <div className="flex-box">
                        <div className="margin-right">
                            <Image className="profile-pic" src={driver.photoURL} size="tiny"/>
                            <Label style={{background: "white"}} as="a" onClick={this.copyToClipboard}>
                                <Icon name="share" size="small"/>
                                {this.state.isCopied === false ? 'Share' : 'Copied'}
                            </Label>
                        </div>
                        <div>
                        {isPending && (
                            <Button 
                                size="small"
                                name="cancel" 
                                onClick={this.handleClick}
                                style={{ float: 'right', padding: "0", border: "none", background: "none"}}>
                               <span style={{color: "#DB4848"}}>Cancel Request</span>
                            </Button>
                        )}
                        <div className="driver">
                            {driver.firstName} {driver.lastName[0]}.
                        </div>
                        <a
                            style={{ color: "#351C75", fontWeight: "bold", fontSize: "18px"}}
                            // className="ride-link" 
                            href={'/ride/' + ride.driverID + '/' + ride._id}>
                            {startLoc.city}, {startLoc.state}
                            <Icon id="arrow" name="long arrow alternate right" />
                            {endLoc.city}, {endLoc.state}
                        </a>    
                        <div className="rideInfo normal-font">
                            <List divided horizontal>
                                <List.Item>{dateString}</List.Item>
                                <List.Item>{timeString}</List.Item>
                                <List.Item>Seats: {ride.capacity}</List.Item>
                                <List.Item>${ride.price}</List.Item>
                            </List>
                        </div>
                        <div className="requestInfo">
                            <span className="lighter-font-weight padding-right">Pick Up:</span>
                            <span className="normal-font">{request.startLoc}</span>
                            <br/>
                            <span className="lighter-font-weight padding-right">Drop off:</span> 
                            <span className="normal-font">{request.endLoc}</span>
                            <br/>
                        </div>
                        {isPending && (
                            <div>
                                Time left for driver to confirm: {hours}hrs{' '}
                                {minutes}mins {seconds}s
                            </div>
                        )}
                        {/* <a href={'/ride/' + driver._id + '/' + ride._id}>
                            View Ride
                        </a> */}

                    </div>
                    </div>
                    
                </List.Item>
            );
        }

        const timeAdded = Math.round(
            (this.state.rideTime - this.props.baseRideTime) / 60
        );
        //From 'My Profile' > 'Created Rides' Tab
        return (
            <List.Item>
                <List.Content>
                    <Image className="profile-pic" floated="left" src={requester.photoURL} size="tiny" />
                    {
                        status === 0 &&
                        <Button 
                            className="map-view"
                            basic
                            // style={{ float: 'right', backgroundColor: "white" }}
                            icon
                            labelPosition="right"
                            size="mini"
                            onClick={this.handleMapClick}
                        >
                            <Icon className="map-marker" name="map marker alternate" />
                            Map View
                        </Button>
                    }
                    
                    <Header as="h5" className="requester">
                        {requester.firstName} {requester.lastName[0]}.
                    </Header>
                    <List.Description 
                        style={{ 
                            fontWeight: "300", 
                            fontSize: "14px", 
                            paddingBottom: "1%",
                            // color: "#333333" 
                        }}
                    >
                        {requester.school}
                    </List.Description>
                                  
                    <div className="request-info-profile-ride-listing">
                        Pick Up: {request.startLoc}
                        <br/>
                        Drop off: {request.endLoc}
                        <br/>
                        {
                            comment && status === 0 && 
                                <span>Comment: {comment}</span>
                        }                               
                        <br/>
                        <span className="estimatedTime">
                        {Boolean(timeAdded) && (
                            <List.Description>
                                {`${
                                    requester.firstName
                                }'s ride would add about ${timeAdded} ${
                                    timeAdded === 1 ? 'minute' : 'minutes'
                                } to your trip`}
                            </List.Description>
                        )}
                        </span>
                    </div>
                </List.Content>       
                {status === 0 &&
                <div extra className="requestActions">
                    <Button
                        basic color="orange"
                        name="deny"
                        size="tiny"
                        onClick={this.handleClick}
                    >
                        Deny Request
                    </Button>
                    <div className="spaceBetweenButtons" />
                    <Button
                        name="confirm"
                        size="tiny"
                        primary
                        onClick={this.handleClick}
                    >
                        Confirm Rider
                    </Button>
                </div>
                }
            </List.Item>
        );
    }
}

export default RequestItem;
