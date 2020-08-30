import React, { Component } from 'react';
import Ride from './Ride';
import './RideList.css';
import { Tab } from 'semantic-ui-react';

class RideList extends Component {
    render() {
        const departRides = <div className="ridelist">
            {this.props.rides.outboundRides.map((ride, i) =>
                <Ride
                    start={ride.startLoc.city + ', ' + ride.startLoc.state}
                    dest={ride.endLoc.city + ', ' + ride.endLoc.state}
                    time={ride.time}
                    driverID={ride.driverID}
                    rideID={ride.rideID}
                    key={i}
                />)}
        </div>;

        const returnRides = <div className="ridelist">
            {this.props.rides.returnRides.map((ride, i) =>
                <Ride
                    start={ride.startLoc.city}
                    dest={ride.endLoc.city}
                    time={ride.time}
                    driverID={ride.driverID}
                    rideID={ride.rideID}
                    key={i}
                />)}
        </div>;

        const panes = [
            { menuItem: 'Outbound Rides', render: () => <Tab.Pane>{departRides}</Tab.Pane> },
            { menuItem: 'Return Ride', render: () => <Tab.Pane>{returnRides}</Tab.Pane> },
        ];

        const renderResults = () => {
            if (this.props.roundtrip) {
                return <Tab className="results-tabs" panes={panes} />;
            } else {
                return departRides;
            }
        };

        return (
            <div>
                {renderResults()}
            </div>
        );
    }
}

export default RideList;
