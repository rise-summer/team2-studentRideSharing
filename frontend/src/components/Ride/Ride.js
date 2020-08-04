import React from 'react';
import { Segment, Header, Icon, Button, Grid } from 'semantic-ui-react';

const Ride = ({ startName, destName, datetime, price, capacity }) => {
    const formatTime = (t) => {
        const year = t.getFullYear();
        const month = t.getMonth() + 1;
        const date = t.getDate();
        var hour = t.getHours();

        var mins = t.getMinutes();
        if (mins < 10) {
            mins = '0' + mins;
        }
        const period = hour < 12 ? 'AM' : 'PM';
        if (hour > 12) {
            hour -= 12;
        }

        return `${month}-${date}-${year} at ${hour}:${mins} ${period}`;
    };
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
                    <Grid.Column>Price: {price}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>Departure: {timeString}</Grid.Column>
                    <Grid.Column>Seats: {capacity}</Grid.Column>
                </Grid.Row>
            </Grid>
            <Button basic negative>
                Cancel Ride
            </Button>
        </Segment>
    );
};

export default Ride;
