import React from 'react';
import CancelRideButton from '../CancelRideButton/CancelRideButton';
import { Segment, Header, Icon, Grid } from 'semantic-ui-react';

const RideProfile = ({ startName, destName, datetime, price, capacity }) => {
    const dateObject = new Date(datetime);
    const dateString = dateObject.toLocaleDateString('en-US');
    const timeString = dateObject.toLocaleTimeString('en-US');

    return (
        <Segment>
            <Header>
                {startName}
                <Icon name="arrow right" />
                {destName}
            </Header>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column>Date: {dateString}</Grid.Column>
                    <Grid.Column>Price: ${price}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>Departure: {timeString}</Grid.Column>
                    <Grid.Column>Seats: {capacity}</Grid.Column>
                </Grid.Row>
            </Grid>
            <CancelRideButton startName={startName} destName={destName} />
        </Segment>
    );
};

export default RideProfile;