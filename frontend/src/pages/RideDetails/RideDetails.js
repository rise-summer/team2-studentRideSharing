import React, { Component } from 'react';
import './RideDetails.css';
import { Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import RequestRide from '../../components/Rides/RequestRide';

class RideDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            driver: {
                // firstName: ""
            },
            ride: {
                startLoc: {},
                endLoc: {}
            }
        };
    }
    componentDidMount() {
        const rideID = this.props.match.params.rideID;
        const rideURL = "/api/rides/" + rideID;
        var requestOptions = {
          method: 'GET',
        };
        //fetch ride info
        fetch(rideURL, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error('Bad Request');
                }
            })
            .then(ride => {
                this.setState({ ride });
            })
            .then(() => { //fetch driver info
                const userURL = "/api/users/" + this.state.ride.driverID;
                fetch(userURL, requestOptions)
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Bad Request');
                    }
                })
                .then(driver => {
                    this.setState({ driver });
                    // console.log(this.state);
                })
                .catch(error => console.log('error', error));//TODO: throw error here?
            })
            .catch(error => console.log('error', error));//TODO: display 400/404 page
    }

    render() {
        var dateObject = new Date(this.state.ride.time);
        const dateString = dateObject.toLocaleDateString('en-US');
        const timeString = dateObject.toLocaleTimeString('en-US');
        return (
            <div>
                <div className="left-column"></div>
                <div className="right-column">
                    <div className="price">Total: ${this.state.ride.price}</div>
                    <RequestRide ride={this.state.ride} driver={this.state.driver} rideID={this.props.match.params.rideID} />
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
                        <div className="ride-detail indent">{this.state.ride.capacity} spot(s) available</div>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="suitcase" />
                        <div className="ride-detail indent">High amount of trunk space left</div>
                    </div>
                    <div className="ride-detail-wrapper">
                        <Icon name="credit card" />
                        <div className="ride-detail indent">Accepts payment through:</div>
                        <div className="indent2">{this.state.driver.payment}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RideDetails;
