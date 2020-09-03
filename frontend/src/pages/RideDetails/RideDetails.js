import React, { Component } from 'react';
import './RideDetails.css';
import { Icon, List, Segment, Image, Label } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
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
            <div className="segment-wrapper">
                <Segment very padded>
                    <div hidden={!render} className="ride-info">
                        <div className="left-column">
                            <Image src={driver.photoURL} size="small"/>
                            <Label className="label-white-background font-small">
                                <Icon color="violet" name="chat"/>
                                Contact Preference <br />
                                <span className="indent">
                                    {Object.keys(driver.contact).map((key, index) => {
                                        // return index === 0 ? key : key
                                        return index === 0 ? <span key={index}>{key}</span> : <span key={index}>, {key}</span>
                                    })}
                                </span>
                            </Label>
                            <Label className="label-white-background font-small">
                                <Icon color="violet" name="credit card"/> 
                                Accepts payment through <br />
                                <span className="indent">
                                    {driver.paymentMethods.map((value, index) => {
                                        return index === 0 ? <span key={index}>{value}</span> : <span key={index}>, {value}</span>
                                    })}
                                </span>
                            </Label>
                            <Label className="label-white-background font-small">
                                <Icon color="violet" name="car"/> {ride.car.color} {ride.car.make} {ride.car.model}
                            </Label>
                        </div>
                        <div className="center-column">
                            {/*TODO: implement redirect back
                            <Link to='/search/'>
                                <button className="view-button">Back</button>
                            </Link>
                            */}
                            <h2 className="driver-name">{driver.firstName} {driver.lastName}</h2>
                            <span>{driver.school}</span>
                            <div className="itinerary">
                                <h5 className="location">
                                    {ride.startLoc.city}, {ride.startLoc.state}
                                    <br/>
                                    <span>Starting Location</span>
                                </h5>
                                <Icon className="ride-details-arrow" name="long arrow alternate right" size="big"/>
                                <h5 className="location">
                                    {ride.endLoc.city}, {ride.endLoc.state}
                                    <br />
                                    <span>Ending Location</span>
                                </h5>
                            </div>
                            <div className="subtitle padding">Date: {dateString}</div>
                            <div className="subtitle padding">Departure Time: {timeString}</div>
                            <div className="ride-detail">
                                {remainCapacity} {remainCapacity > 1 ? 'Seats' : 'Seat'} Available
                            </div>
                            <div className="ride-detail-wrapper">
                                {confirmedCount > 0 &&
                                    <Label className="label-white-background font-medium">
                                    <Icon color="violet" name="user"></Icon> Booked Riders
                                    </Label>
                                }
                                <div className="indent2">
                                    <List className='requestCards'>
                                        {requests.map((request, index) =>
                                            <RequestItem
                                                key={index} request={request} dateString={dateString} timeString={timeString} viewer="Other"
                                        />)}
                                    </List>
                                </div>
                            </div>
                            {/* <div className="ride-detail-wrapper">
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
                                <div className="indent2">
                                    {driver.paymentMethods.map((value, index) => {
                                        return index === 0 ? <span key={index}>{value}</span> : <span key={index}>, {value}</span>
                                    })}
                                </div>
                            </div> */}
                        </div>
                        <div className="right-column">
                            <div className="price">
                                <span>Total: </span>
                                <span>${ride.price}</span>
                            </div>
                            <RequestRide ride={ride} uid={this.props.uid} driver={driver} rideID={rideID} dateString={dateString} timeString={timeString} disable={remainCapacity < 1 ? true : false} />
                            <Label className="label-white-background font-medium" as="a" onClick={this.copyToClipboard}>
                                <Icon name="share" size="large"/>
                                {this.state.isCopied === false ? 'Share Ride' : 'Link is Copied'}
                            </Label>
                        </div>
                    </div>
                    <div hidden={render}><center>Ride not found (404).</center></div>
                </Segment>
            </div>
        )
    }
}

export default withRouter(RideDetails);
