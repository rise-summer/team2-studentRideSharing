import React, { Component } from 'react';
import { auth } from "../../firebase";

import ProfileTabs from '../../components/UserProfiles/ProfileTabs';
import { Grid, Header, Image, Message } from 'semantic-ui-react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
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
        auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                const userId = data.uid;
                this.setState({userId});
                fetch(`/api/users/${userId}`)
                    .then((response) => response.json())//TODO: error handling
                    .then(user => {
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
            else {
                this.setState({userId: ""});
            }
        });
    }

    handleError = (errorMessage) =>
        this.setState({ errorMessage: errorMessage });

    handleErrorDismiss = () => {
        this.setState({ errorMessage: '' });
    };

    render() {
        const { userId } = this.props;
        const {user, vehicles, rides, errorMessage} = this.state;
        const {
            firstName,
            lastName,
            school,
            contact,
            email,
        } = user;
        if (userId === "") {
            return null;
        }
        return (
            <div>
                {errorMessage && (
                    <Message
                        negative
                        floating
                        onDismiss={this.handleErrorDismiss}
                        header="Cancellation"
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
                            userID={userId}
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
