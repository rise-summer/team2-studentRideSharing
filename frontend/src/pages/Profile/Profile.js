import React, { Component } from 'react';
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs';
import { Grid, Header, Image, Message } from 'semantic-ui-react';

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
            errorMessage: '',
            // These are currently unused
            addresses: '',
            ratingDriver: '',
            ratingPassenger: '',
        };
    }

    componentDidMount() {
        const { userId } = this.props;
        fetch(`/api/users/${userId}`)
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

        fetch(`/api/vehicles/${userId}`)
            .then((response) => response.json())
            .then((vehicles) =>
                this.setState({
                    vehicles: vehicles,
                })
            )
            .catch((error) => console.log('error', error));

        // Would it be better to fetch the rides when ProfileListing is rendered?
        fetch(`/api/rides/${userId}`)
            .then((response) => response.json())
            .then((rides) =>
                this.setState({
                    rides: rides,
                })
            )
            .catch((error) => console.log('error', error));
    }

    // TODO: handleCancel doesn't affect how rides are displayed
    handleCancel = (id) => {
        fetch(`/api/rides/cancel/${this.props.userId}/${id}`, { method: 'PUT' })
            .then((response) => response.text())
            .then((result) => this.setState({errorMessage: result}))
            .catch((error) => console.log('error', error));
    };

    handleErrorDismiss = () => {
        this.setState({ errorMessage: '' });
    };

    render() {
        const {
            firstName,
            lastName,
            school,
            vehicles,
            contact,
            email,
            rides,
            errorMessage,
        } = this.state;
        return (
            <div>
                {errorMessage && (
                    <Message
                        negative
                        floating
                        onDismiss={this.handleErrorDismiss}
                        header="Cancellation Error"
                        content={errorMessage}
                    />
                )}

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
                            handleCancel={this.handleCancel}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Profile;
