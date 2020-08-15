import React, { Component } from 'react';
import { List, Divider } from 'semantic-ui-react';
import RequestItem from '../Requests/RequestItem';

class ProfileRequests extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewer: "Requester",
            requests:[]
        }
    }

    componentDidMount() {
        this.fetchUserRequests();
    }

    fetchUserRequests() {
        //fetch requests info of the current user
        fetch(`/api/requests?user=${this.props.userID}`)
            .then(response => {
                return response.json();
            })
            .then(requests => {
                this.setState({ requests });
            })
            .catch(error => console.log('error', error));
    }

    render() {
        const { requests, viewer } = this.state;
        const pendingRequests = requests.filter((request) => request.status === 0);
        const confirmedRequests = requests.filter((request) => request.status === 1);
        const pendingCount = pendingRequests.length;
        const confirmedCount = confirmedRequests.length;

        return(
            <div>
                {
                    confirmedCount > 0 &&
                    <div className='confirmedRides'>
                        <div>{confirmedCount} Confirmed {confirmedCount > 1 ? "Rides": "Ride"}</div>
                        <List className='requestsList' divided animated>
                            {confirmedRequests.map((request, index) =>
                                <RequestItem
                                    key={index} request={request} viewer={viewer}
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
                            {pendingRequests.map((request,index) =>
                                <RequestItem
                                    key={index} request={request} viewer={viewer} onActionButtonClick={ () => this.fetchUserRequests() } isPending='true'
                            />)}
                        </List>
                    </div>
                }
            </div>
        )
    }
}

export default ProfileRequests;
