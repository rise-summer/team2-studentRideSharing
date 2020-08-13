import React, { Component } from 'react';
import { List, Button } from 'semantic-ui-react';
import './RequestItem.css'

class RequestItem extends Component {
    constructor (props) {
        super(props);
        this.state = {
            request: {},
            requester: {
                lastName: ""
            },
            errorMessage: ""
        }
    }
    componentDidMount() {
        //fetch requester info
        fetch(`/api/users/${this.props.request.ownerID}`)
            .then(response => {
                return response.json();
            })
            .then(requester => {
                this.setState({ requester });
            })
            .catch(error => console.log('error', error));
    }

    handleClick = (event) => {
        const action = event.target.name; //deny or confirm
        //event.target.name
        //='deny' - change status from 0 to 2
        //='confirm' - change status from 0 to 1
        fetch(`/api/requests/${action}/${this.props.request._id}`, { method: 'PUT' })
            .then((response) =>
            {
                if(response.ok) {
                    this.sendEmailNotificationToRequester(action);
                    this.props.onActionButtonClick();//data fetching function from the parent component RideProfile
                }
                return response.text();
            })
            .then((result) => this.setState({errorMessage: result}))
            .catch((error) => console.log('error', error));
    }

    sendEmailNotificationToRequester(action) {
        const {ride, dateString, timeString} = this.props;
        const {firstName, lastName, email} = this.state.requester;
        const {make, model, color, plate} = ride.car;
        const dynamic_template_data = {
            "startLoc": ride.startLoc.displayName,
            "endLoc": ride.endLoc.displayName,
            "driverFirstName": "Joe", //TODO: current user's first name
            "requesterFirstName": firstName,
            "startDate": dateString,
            "startTime": timeString,
            "contact": "999-999-9999", //TODO: current user's contact info
            //"rideURL": window.location.href,
            "siteURL": window.location.origin,
            "make": make,
            "model": model,
            "color": color,
            "plate": plate
        };
        var requestBody = {
            "requesterMail": email,
            "requesterFirstName": firstName,
            "requesterLastName": lastName,
            "dynamic_template_data": dynamic_template_data
        };
        console.log(requestBody);
        const url = "/api/requests/email/"+ action + "/"  + ride._id;
        var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        };
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }


    render() {
        const {firstName, lastName, school} = this.state.requester;
        const {request, version} = this.props;//version controls what to display
        const {comment, startLoc, endLoc, status} = request;
        if(version === "RideDetailsPage") {
            if(status !== 1) { //hide non-confirmed requests
                return null;
            }
            else { //display only name and school
                return (
                    <List.Item>
                        <List.Content className='requester'>
                            <div>{firstName} {lastName[0]}.</div>
                            <div className='school'>{school}</div>
                        </List.Content>
                    </List.Item>
                )
            }
        }
        return (
            <List.Item>
                <List.Header className='requester'>
                    <div className='name'>{firstName} {lastName[0]}.</div>
                    <div className='school'>{school}</div>
                </List.Header>
                <List.Content>
                    <div className='requestInfo'>
                        <div>Pick Up: {startLoc}</div>
                        <div>Drop off: {endLoc}</div>
                        {comment &&
                            <div>Comment: {comment}</div>
                        }
                    </div>
                    {
                        status === 0 &&
                        <div className='requestActions'>
                            <Button name='deny' negative onClick={this.handleClick}>Deny</Button>
                            <Button name='confirm' positive onClick={this.handleClick}>Confirm</Button>
                        </div>
                    }
                </List.Content>
            </List.Item>
        )
    }
}

export default RequestItem;
