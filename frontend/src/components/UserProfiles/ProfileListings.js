import React, { useState } from 'react';
import RideProfile from '../Rides/RideProfile';
import Map from '../Rides/Map';
import { Header, Grid } from 'semantic-ui-react';

const ProfileListings = ({ rides, handleError }) => {
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into RideProfile and unpack everything in there?
    // TODO: render displayname instead of city
    const [mapCoords, setMapCoords] = useState({
        origin: [],
        destination: [],
    });

    const [waypoints, setWaypoints] = useState([]);

    const activeRides = rides.filter((ride) => !ride.status || ride.status === 0);
    const completedRides = rides.filter((ride) => ride.status && ride.status === 1);
    // const cancelledRides = rides.filter((ride) => ride.status && ride.status === 2);
    const activeRideList = activeRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                isActive
                handleError={handleError}
                setMapCoords={setMapCoords}
                setWaypoints={setWaypoints}
            />
        )
    );
    const completedRideList = completedRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                handleError={handleError}
                setMapCoords={setMapCoords}
                setWaypoints={setWaypoints}
                />
        )
    );
    // const cancelledRideList = cancelledRides.map((ride, index) => (
    //     <RideProfile
    //         key={index}
    //         ride={ride}
    //         isCancelled
    //     />
    // ));
    return (
        <Grid>
            <Grid.Column width={10}>
                <Header as="h4" content="Active" />
                {activeRideList}
                <Header as="h4" content="Completed" />
                {completedRideList}
            </Grid.Column>
            <Grid.Column width={6}>
                <Map
                    origin={mapCoords.origin}
                    destination={mapCoords.destination}
                    waypoints={waypoints}
                />
            </Grid.Column>
        </Grid>
    );
};

export default ProfileListings;
