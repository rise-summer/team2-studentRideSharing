import React from 'react';
import Ride from '../Ride/Ride';

const ProfileListings = ({ rides }) => {
    // startName, destName, datetime, price, seats
    // Would it be better to pass rides directly into Ride and unpack everything in there?
    // TODO: render displayname instead of city
    const rideList = rides.map(
        ({ startLoc, endLoc, time, price, capacity }) => (
            <Ride
                startName={startLoc.city}
                destName={endLoc.city}
                datetime={time}
                price={price}
                capacity={capacity}
            />
        )
    );
    return (
        <div>
            {rideList}
            {/* <pre>{JSON.stringify(rides, null, 4)}</pre> */}
        </div>
    );
};

export default ProfileListings;