import React from 'react';
import RideProfile from '../Rides/RideProfile';
import { Header } from 'semantic-ui-react';

const ProfileListings = ({ rides, handleCancel }) => {
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into RideProfile and unpack everything in there?
    // TODO: render displayname instead of city
    const activeRides = rides.filter((ride) => !ride.status || ride.status === 0);
    const completedRides = rides.filter((ride) => ride.status && ride.status === 1);
    const activeRideList = activeRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                handleCancel={handleCancel}
                isActive
            />
        )
    );
    const completedRideList = completedRides.map(
        (ride, index) => (
            <RideProfile
                key={index}
                ride={ride}
                handleCancel={handleCancel}
            />
        )
    );
    return (
        <div>
            <Header as="h4" content="Active" />
            {activeRideList}
            <Header as="h4" content="Completed" />
            {completedRideList}
            {/* <pre>{JSON.stringify(rides, null, 4)}</pre> */}
        </div>
    );
};

export default ProfileListings;
