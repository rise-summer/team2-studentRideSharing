import React, { Component } from 'react';
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs';
import { Grid, Header, Image } from 'semantic-ui-react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            contact: {
                phone: '',
            },
            vehicles: [],
            // The rides the user has posted
            rides: [],
            // These are currently unused
            addresses: '',
            ratingDriver: '',
            ratingPassenger: '',
        };
    }

    componentDidMount() {
        fetch(`http://localhost:3000/api/users/${this.props.userId}`)
            .then((response) => response.json())
            .then(({ email, firstName, lastName, contact }) =>
                this.setState({
                    // TODO: put email and phone in .contact
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    contact: contact,
                })
            )
            .catch((error) => console.log('error', error));

        fetch(`http://localhost:3000/api/vehicles/${this.props.userId}`)
            .then((response) => response.json())
            .then((vehicles) =>
                this.setState({
                    vehicles: vehicles,
                })
            )
            .catch((error) => console.log('error', error));

        // Would it be better to fetch teh rides when ProfileListing is rendered?
        fetch(`http://localhost:3000/api/rides/${this.props.userId}`)
            .then((response) => response.json())
            .then((rides) =>
                this.setState({
                    rides: rides,
                })
            )
            .catch((error) => console.log('error', error));
    }
    render() {
        const {
            firstName,
            lastName,
            school,
            vehicles,
            contact,
            email,
            rides,
        } = this.state;
        return (
            <div>
                <Grid
                    textAlign="center"
                    style={{ height: '100vh' }}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h1">
                            {firstName + ' ' + lastName}
                            <Header.Subheader>{school}</Header.Subheader>
                        </Header>
                        <ProfileTabs
                            vehicles={vehicles}
                            contact={contact}
                            email={email}
                            rides={rides}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Profile;
