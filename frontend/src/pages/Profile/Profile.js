import React, { Component } from 'react';
import ProfileTabs from '../../components/UserProfiles/ProfileTabs';
import { Grid, Header, Image, Message } from 'semantic-ui-react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                contact: {
                    // TODO: put email and phone in .contact
                    phone: '',
                },
            },
            vehicles: [],
            // The rides the user has posted
            rides: [],
            errorMessage: '',
        };
    }

    componentDidMount() {
        // const userId = "5f34f3f66a7bcd0c1dbf17e4";// temporary testing
        const { userId } = this.props;
        fetch(`/api/users/${userId}`)
            .then((response) => response.json()) //TODO: error handling
            .then((user) => {
                this.setState({ user });
            })
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

    handleError = (errorMessage) =>
        this.setState({ errorMessage: errorMessage });

    handleErrorDismiss = () => {
        this.setState({ errorMessage: '' });
    };

    render() {
        const { user, vehicles, rides, errorMessage } = this.state;
        const { firstName, lastName, school, contact, email } = user;
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
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{ width: '80%' }}>
                        <Header as="h1" style={{ textAlign: 'center' }}>
                            {firstName + ' ' + lastName}
                            <Header.Subheader>{school}</Header.Subheader>
                        </Header>
                        <ProfileTabs
                            vehicles={vehicles}
                            contact={contact}
                            email={email}
                            rides={rides}
                            handleError={this.handleError}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Profile;
