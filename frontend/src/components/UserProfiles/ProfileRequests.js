import React, { Component } from 'react';
import { List, Divider } from 'semantic-ui-react';
import RequestItem from '../Requests/RequestItem';
import './ProfileRequests.css';
class ProfileRequests extends Component {
    _isMounted = false;

    constructor (props) {
        super(props);
        this.state = {
            viewer: "Requester",
            requests:[]
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchUserRequests();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchUserRequests() {
        //fetch requests info of the current user
        fetch(`/api/requests?user=${this.props.userID}`)
            .then(response => {
                return response.json();
            })
            .then(requests => {
                if(this._isMounted) {//To prevent state update on an unmounted component
                    this.setState({ requests });
                }
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
            <div style={{width: "70%", margin: "auto"}}>
                {
                    confirmedCount > 0 &&
                    <div className='confirmedRides'>
                        <div>{confirmedCount} Confirmed {confirmedCount > 1 ? "Rides": "Ride"}</div>
                        <List className="requestsList-profile" divided verticalAlign="middle">
                            {confirmedRequests.map((request, index) =>
                                <RequestItem
                                    key={index} request={request} viewer={viewer} parentRefetch={ () => this.fetchUserRequests() }
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
                        <List className="requestsList-profile" divided verticalAlign="middle">
                            {pendingRequests.map((request,index) =>
                                <RequestItem
                                    key={index} request={request} viewer={viewer} parentRefetch={ () => this.fetchUserRequests() } isPending='true'
                            />)}
                        </List>
                    </div>
                }
            </div>
        )
    }
}

export default ProfileRequests;
