import React, { useState, createRef  } from 'react';
import RideProfile from '../Rides/RideProfile';
import Map from '../Rides/Map';
import { Header, Grid, List } from 'semantic-ui-react';
import './ProfileListings.css';

const ProfileListings = ({ rides, handleError }) => {
    const contextRef = createRef();
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into RideProfile and unpack everything in there?
    // TODO: render displayname instead of city
    const [waypoints, setWaypoints] = useState([]);
    const [lineString, setLineString] = useState([]);

    const activeRides = rides.filter(
        (ride) => !ride.status || ride.status === 0
    );
    const completedRides = rides.filter(
        (ride) => ride.status && ride.status === 1
    );
    // const cancelledRides = rides.filter((ride) => ride.status && ride.status === 2);
    const activeRideList = activeRides.map((ride, index) => (
        <List.Item className="ride-list-item">
            <RideProfile
                key={index}
                ride={ride}
                isActive
                handleError={handleError}
                setWaypoints={setWaypoints}
                setLineString={setLineString}
            />
        </List.Item>
    ));
    const completedRideList = completedRides.map((ride, index) => (
        <List.Item className="ride-list-item">
            <RideProfile
                key={index}
                ride={ride}
                handleError={handleError}
                setWaypoints={setWaypoints}
                setLineString={setLineString}
            />
        </List.Item>
    ));
    // const cancelledRideList = cancelledRides.map((ride, index) => (
    //     <RideProfile
    //         key={index}
    //         ride={ride}
    //         isCancelled
    //     />
    // ));
    return (
        <Grid>
            <Grid.Column style={{width: "60%", margin: "auto"}}>
                <Header content="Active Listings" />
                <List 
                    className="ride-listings" 
                    divided 
                    // selection
                    // animated
                >        
                    {activeRideList}
                </List>

                <Header content="Previous Listings" />
                <List 
                    className="ride-listings" 
                    divided 
                    // selection
                    // animated
                > 
                    {completedRideList}
                </List>
            </Grid.Column>
            <Grid.Column style={{width: "40%", margin: "auto", marginTop: "5%"}}>
                <Map
                    waypoints={waypoints}
                    lineString={lineString}
                />
            </Grid.Column>
        </Grid>
    );
};

export default ProfileListings;
