import React, { Component } from 'react';
import Ride from './Ride';
import './RideList.css';

class RideList extends Component {
    render() {
        return (
            <div className="ridelist">
                {this.props.rides.map((ride, i) => (
                    <Ride
                        start={ride.startLoc.city + ', ' + ride.startLoc.state}
                        dest={ride.endLoc.city + ', ' + ride.endLoc.state}
                        time={new Date(ride.time)}
                        rideID={ride.rideID}
                        driverID={ride.driverID}
                        key={i}
                    />
                ))}
            </div>
        );
    }
}

export default RideList;
