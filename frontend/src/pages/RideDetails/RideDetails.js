import React, { Component } from 'react';
import './RideDetails.css';
import { Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import RequestRide from '../../components/Rides/RequestRide';

class RideDetails extends Component {
    requestRide = () => {
        alert('HELLO WORLD');
    };

    render() {
        return (
            <div>
                <div className="left-column"></div>
                <div className="right-column">
                    <div className="price">Total: $15</div>
                    <RequestRide />
                </div>
                <div className="center-column">
                    <Link to='/search/'>
                        <button className="view-button">Back</button>
                    </Link>
                    <div className="name padding">Elliot S.</div>
                    <div className="subtitle padding">San Diego State University</div>
                    <div className="itinerary">
                        <div className="location">Oxnard, CA</div>
                        <Icon name="arrow right" />
                        <div className="location">La Jolla, CA</div>
                    </div>
                    <div className="subtitle padding">Date: 09/17/2020</div>
                    <div className="subtitle padding">Departure Time: 1:00 PM</div>
                    <div className="name padding">Ride Details</div>

                    <div className="ride-detail-wrapper">
                        <Icon name="user" />
                        <div className="ride-detail indent">1 spot available</div>
                    </div>

                    <div className="ride-detail-wrapper">
                        <Icon name="suitcase" />
                        <div className="ride-detail indent">High amount of trunk space left</div>
                    </div>

                    <div className="ride-detail-wrapper">
                        <Icon name="credit card" />
                        <div className="ride-detail indent">Accepts payment through:</div>
                        <div className="indent2">Venmo, Zelle, Cash</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RideDetails;
