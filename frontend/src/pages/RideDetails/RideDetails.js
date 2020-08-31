import React, { Component } from 'react';
import './RideDetails.css';
import { Icon, Button, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import RequestRide from '../../components/Rides/RequestRide';
import RequestItem from '../../components/Requests/RequestItem';

class RideDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            rideID: '',
            driverID: '',
            driver: {
                paymentMethods: [],
                contact: {}
                // firstName: ""
            },
            ride: {
                startLoc: {},
                endLoc: {},
                car: {}
            },
            requests: [],
            render: true, //temporary solution for RideID 404
            isCopied:false
        };
    }

    componentDidMount() {
        const rideID = this.props.match.params.rideID;
        const driverID = this.props.match.params.driverID;
        this.setState({ rideID, driverID });
        const rideURL = "/api/rides/" + driverID + "/" + rideID;
        const userURL = "/api/users/" + driverID;
        var requestOptions = {
          method: 'GET',
        };
        //fetch ride info
        fetch(rideURL, requestOptions)
            .then(response => {
                if(response.ok) {
                    this.setState({render: true})
                    return response.json();
                } else {
                    this.setState({render: false})
                    throw new Error('Bad Request');
                }
            })
            .then(ride => {
                this.setState({ ride });
            })
            .catch(error => console.log('error', error));
        //fetch driver info
        fetch(userURL, requestOptions)
            .then(response => {
                if(response.ok) {
                    this.setState({render: true})
                    return response.json();
                } else {
                    this.setState({render: false})
                    throw new Error('Bad Request');
                }
            })
            .then(driver => {
                this.setState({ driver });
                // console.log(this.state);
            })
            .catch(error => console.log('error', error));
        //fetch requests info
        fetch(`/api/requests?ride=${rideID}`)
            .then(response => {
                if(response.ok) {
                    this.setState({render: true})
                    return response.json();
                } else {
                    this.setState({render: false})
                    throw new Error('Bad Request');
                }
            })
            .then(requests => {
                this.setState({ requests });
                // console.log(this.state);
            })
            .catch(error => console.log('error', error));

    }

    copyToClipboard = (event) => {
        window.navigator.clipboard.writeText(window.location.href).then(() => {
            this.setState({isCopied: true});
        }).catch(err => {
            console.log('Something went wrong', err);
            alert("Failed to copy the url to the clipboard. You might manually copy that and share the link!");
        });
    }

    render() {
        const {rideID, requests, ride, render, driver} = this.state;
        var dateObject = new Date(ride.time);
        const dateString = dateObject.toLocaleDateString('en-US');
        const timeString = dateObject.toLocaleTimeString('en-US');
        const confirmedCount = requests.filter((request) => request.status === 1).length;
        const remainCapacity = ride.capacity - confirmedCount;
        return (
            <div>
            <div hidden={!render}>
                <div className="left-column">
                </div>
                <div className="left-section">
                    <center>{ride.car.color} {ride.car.make} {ride.car.model}</center>
                    <br/>
                    <center>
                        <Button icon onClick={this.copyToClipboard}>
                            <Icon name="share alternate" size='large'/>
                            {this.state.isCopied === false ? <div>share</div> : <div>Link is Copied</div> }
                        </Button>
                    </center>
                </div>
                <div className="right-column">
                    <div className="price">Total: ${ride.price}</div>
                    <RequestRide ride={ride} uid={this.props.uid} driver={driver} rideID={rideID} dateString={dateString} timeString={timeString} disable={remainCapacity < 1 ? true: false} />
                </div>
                <div className="center-column">
                    {/*TODO: implement redirect back
                    <Link to='/search/'>
                        <button className="view-button">Back</button>
                    </Link>
                    */}
                    <div className="name padding">{driver.firstName} {driver.lastName}</div>
                    <div className="subtitle padding">{driver.school} </div>
                    <div className="itinerary">
                        <div className="location">{ride.startLoc.city}, {ride.startLoc.state}</div>
                        <Icon name="arrow right" />
                        <div className="location">{ride.endLoc.city}, {ride.endLoc.state}</div>
                    </div>
                    <div className="subtitle padding">Date: {dateString}</div>
                    <div className="subtitle padding">Departure Time: {timeString}</div>
                    <div className="name padding">Ride Details</div>
                    <div className="ride-detail-wrapper">
                        <Icon name="user" />
                        <div className="ride-detail indent">
                            {remainCapacity} {remainCapacity > 1 ? 'spots' : 'spot'} remaining
                        </div>
                        <div className="indent2">
                            {confirmedCount > 0 &&
                            <div>Booked Riders</div>
                            }
                            <List className='requestCards'>
                                {requests.map((request, index) =>
                                    <RequestItem
                                        key={index} request={request} dateString={dateString} timeString={timeString} viewer="Other"
                                />)}
                            </List>
                        </div>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="phone square" />
                        <div className="ride-detail indent">Preferred Methods of Contact</div>
                        <div className="indent2">
                            {Object.keys(driver.contact).map((key, index) => {
                                return index === 0 ? <span key={index}>{key}</span> : <span key={index}>, {key}</span>
                            })}
                        </div>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="credit card" />
                        <div className="ride-detail indent">Preferred Methods of Payment</div>
                        {/* <div className="indent2">
                            {driver.paymentMethods.map((value, index) => {
                                return index === 0 ? <span key={index}>{value}</span> : <span key={index}>, {value}</span>
                            })}
                        </div> */}
                    </div>
                </div>
            </div>
            <div hidden={render}><center>Ride not found (404).</center></div>
            </div>
        )
    }
}

export default withRouter(RideDetails);
