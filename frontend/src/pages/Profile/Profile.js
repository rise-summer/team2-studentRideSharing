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
                contact: { // TODO: put email and phone in .contact
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
        const userId = "5f32fb292781120606f937ce";// temporary testing
        // const { userId } = this.props;
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
        const {user, vehicles, rides, errorMessage} = this.state;
        const {
            firstName,
            lastName,
            school,
            contact,
            email,
        } = user;
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
                    style={{ 'height': '100%', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }}
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
                            handleCancel={this.handleCancel}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Profile;
