import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileTabs from '../../components/UserProfiles/ProfileTabs';
import { Grid, Header, Image, Message } from 'semantic-ui-react';

/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    uid: state.uid,
});

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
        const { uid } = this.props;
        fetch(`/api/users/${uid}`)
            .then((response) => response.json())//TODO: error handling
            .then(user => {
                this.setState({ user });
            })
            .catch((error) => console.log('error', error));

        fetch(`/api/vehicles/${uid}`)
            .then((response) => response.json())
            .then((vehicles) =>
                this.setState({
                    vehicles: vehicles,
                })
            )
            .catch((error) => console.log('error', error));
        // Would it be better to fetch the rides when ProfileListing is rendered?
        fetch(`/api/rides/${uid}`)
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
        const { uid } = this.props;
        const {user, vehicles, rides, errorMessage} = this.state;
        const {
            firstName,
            lastName,
            school,
            contact,
            email,
            photoURL,
        } = user;

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
                            <Image src={photoURL} avatar/>
                            {firstName + ' ' + lastName}
                            <Header.Subheader>{school}</Header.Subheader>
                        </Header>
                        <ProfileTabs
                            userID={uid}
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

export default connect(mapStateToProps)(Profile);
