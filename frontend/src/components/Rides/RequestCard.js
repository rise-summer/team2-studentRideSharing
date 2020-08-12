import React, { Component } from 'react';
import { Header, List, Button } from 'semantic-ui-react';
import './RequestCard.css'

class RequestCard extends Component {
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
        //event.target.name
        //='deny' - change status from 0 to 2
        //='confirm' - change status from 0 to 1
        fetch(`/api/requests/${event.target.name}/${this.props.request._id}`, { method: 'PUT' })
            .then((response) =>
            {
                if(response.ok) {
                    this.props.onActionButtonClick();//data fetching function from the parent component RideProfile
                }
                return response.text();
            })
            .then((result) => this.setState({errorMessage: result}))
            .catch((error) => console.log('error', error));
    }

    render() {
        const {firstName, lastName, school} = this.state.requester;
        const {comment, startLoc, endLoc, status} = this.props.request;
        return (
            <List.Item>
            {status}
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
                        status == 0 &&
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

export default RequestCard;
