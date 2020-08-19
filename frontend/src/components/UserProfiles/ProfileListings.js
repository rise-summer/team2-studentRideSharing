import React from 'react';
import RideProfile from '../Rides/RideProfile';
import { Header } from 'semantic-ui-react';

const ProfileListings = ({ rides, handleError }) => {
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into RideProfile and unpack everything in there?
    // TODO: render displayname instead of city
    const activeRides = rides.filter((ride) => !ride.status || ride.status === 0);
    const cancelledRides = rides.filter((ride) => ride.status && ride.status === 2);
    const activeRideList = activeRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                handleError={handleError}
            />
        )
    );
    const cancelledRideList = cancelledRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                handleError={handleError}
                isCancelled
            />
        )
    );
    return (
        <div>
            <Header as="h4" content="Active" />
            {activeRideList}
            <Header as="h4" content="Cancelled" />
            {cancelledRideList}
        </div>
    );
};

export default ProfileListings;
