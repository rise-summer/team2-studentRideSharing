import React, { Component } from 'react';
import Ride from "./Ride";
import './RideList.css'
import { Tab } from 'semantic-ui-react';

class RideList extends Component {
    render() {
        const roundtrip = this.props.roundtrip;

        const departRides = <div className='ridelist'>
            {this.props.rides.map((ride, i) =>
                <Ride start={ride.startLoc}
                      dest={ride.endLoc}
                      time={ride.time}
                      key={i}
                />)}
        </div>;

        const panes = [
            { menuItem: 'First Ride', render: () => <Tab.Pane>{departRides}</Tab.Pane> },
            { menuItem: 'Return Ride', render: () => <Tab.Pane>Return Rides</Tab.Pane> },
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
