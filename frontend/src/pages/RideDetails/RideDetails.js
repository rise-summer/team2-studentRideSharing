import React, { Component } from 'react';
import './RideDetails.css';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import RequestRide from '../../components/Rides/RequestRide';

class RideDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
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
            render: true, //temporary solution for RideID 404
            isCopied:false
        };
    }

    componentDidMount() {
        const rideID = this.props.match.params.rideID;
        const driverID = this.props.match.params.driverID;
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
        var dateObject = new Date(this.state.ride.time);
        const dateString = dateObject.toLocaleDateString('en-US');
        const timeString = dateObject.toLocaleTimeString('en-US');
        return (
            <div>
            <div hidden={!this.state.render}>
                <div className="left-column">
                </div>
                <div className="left-section">
                    <center>{this.state.ride.car.color} {this.state.ride.car.make} {this.state.ride.car.model}</center>
                    <br/>
                    <center>
                        <Button icon onClick={this.copyToClipboard}>
                            <Icon name="share alternate" size='large'/>
                            {this.state.isCopied === false ? <div>share</div> : <div>Link is Copied</div> }
                        </Button>
                    </center>
                </div>
                <div className="right-column">
                    <div className="price">Total: ${this.state.ride.price}</div>
                    {/*TODO: disable the button if ride not available for new request*/}
                    <RequestRide ride={this.state.ride} driver={this.state.driver} rideID={this.props.match.params.rideID} dateString={dateString} timeString={timeString} />
                </div>
                <div className="center-column">
                    <Link to='/search/'>
                        <button className="view-button">Back</button>
                    </Link>
                    <div className="name padding">{this.state.driver.firstName} {this.state.driver.lastName}</div>
                    <div className="subtitle padding">{this.state.driver.school} </div>
                    <div className="itinerary">
                        <div className="location">{this.state.ride.startLoc.city}, {this.state.ride.startLoc.state}</div>
                        <Icon name="arrow right" />
                        <div className="location">{this.state.ride.endLoc.city}, {this.state.ride.endLoc.state}</div>
                    </div>
                    <div className="subtitle padding">Date: {dateString}</div>
                    <div className="subtitle padding">Departure Time: {timeString}</div>
                    <div className="name padding">Ride Details</div>
                    <div className="ride-detail-wrapper">
                        <Icon name="user" />
                        <div className="ride-detail indent">{this.state.ride.capacity} {this.state.ride.capacity > 1 ? 'spots' : 'spot'} available</div>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="phone square" />
                        <div className="ride-detail indent">Preferred Methods of Contact</div>
                        <ul>
                            {
                                Object.keys(this.state.driver.contact).map((key, index) => {
                                    return index === 0 ? <li key={index}>{key}</li> : <li key={index}>, {key}</li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="credit card" />
                        <div className="ride-detail indent">Preferred Methods of Payment
                            <ul>
                                {this.state.driver.paymentMethods.map((value, index) => {
                                    return index === 0 ? <li key={index}>{value}</li> : <li key={index}>, {value}</li>
                              })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div hidden={this.state.render}><center>Ride not found (404).</center></div>
            </div>
        )
    }
}

export default RideDetails;
