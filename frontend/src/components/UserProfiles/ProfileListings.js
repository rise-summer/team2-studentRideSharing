import React from 'react';
import RideProfile from '../Rides/RideProfile';
import { Header } from 'semantic-ui-react';

const ProfileListings = ({ rides, handleCancel }) => {
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into RideProfile and unpack everything in there?
    // TODO: render displayname instead of city
    const activeRides = rides.filter((ride) => !ride.status || ride.status === 0);
    const cancelledRides = rides.filter((ride) => ride.status && ride.status === 2);
    const activeRideList = activeRides.map(
        ({ startLoc, endLoc, time, price, capacity, _id }) => (
            <RideProfile
                startName={startLoc.city}
                destName={endLoc.city}
                datetime={time}
                price={price}
                capacity={capacity}
                id={_id}
                handleCancel={handleCancel}
            />
        )
    );
    const cancelledRideList = cancelledRides.map(
        ({ startLoc, endLoc, time, price, capacity, _id }) => (
            <RideProfile
                startName={startLoc.city}
                destName={endLoc.city}
                datetime={time}
                price={price}
                capacity={capacity}
                id={_id}
                handleCancel={handleCancel}
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
            {/* <pre>{JSON.stringify(rides, null, 4)}</pre> */}
        </div>
    );
};

export default ProfileListings;
