import React, { Component } from 'react';
import { connect } from 'react-redux';
// import ProfileTabs from '../../components/UserProfiles/ProfileTabs'; //TODO: remove the file
import ProfileDetails from '../../components/UserProfiles/ProfileDetails';
import ProfileListings from '../../components/UserProfiles/ProfileListings';
import ProfileRequests from '../../components/UserProfiles/ProfileRequests';
import { Grid, Header, Image, Message, Button, Icon,  Tab, Menu, Label, GridColumn } from 'semantic-ui-react';
import './Profile.css';
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
            activeIndex: 0,//TODO: change it back to 0
            isEditingProfile: false,
            errorMessage: '',
        };
    }

    componentDidMount() {
        const { uid } = this.props;
        fetch(`/api/users/${uid}`)
            .then((response) => response.json())//TODO: error handling
            .then(user => {
                this.setState({ user });
                console.log(user);
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

    
    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeIndex });
    }

    //When 'Edit Profile' Button is OnClick
    handleEditProfile = () => {
        this.setState( { isEditingProfile: true });
    }
  
    //When 'Save Changes' Button is OnClick
    handleSaveProfile = () => {
        this.setState( { isEditingProfile: false });
    }

    //When 'Cancel' Button is OnClick - User cancelled profile editing
    handleCancelEditing = () => {
        this.setState( { isEditingProfile: false });
    }

    handleError = (errorMessage) =>
        this.setState({ errorMessage: errorMessage });

    handleErrorDismiss = () => {
        this.setState({ errorMessage: '' });
    };

    render() {
        const { uid } = this.props;
        const {user, vehicles, rides, activeIndex, isEditingProfile, errorMessage} = this.state;
        const {
            firstName,
            lastName,
            school,
            contact,
            email,
            photoURL,
        } = user;
        //Three Panes: 'My Listings', 'My Requests', and 'My Profile'
        const panes = [
            {
                menuItem: (
                    <Menu.Item key="listings">
                        Created Rides
                        <Label circular size="mini" color="black">
                            {rides.filter((ride) => !ride.status || ride.status === 0).length}
                        </Label>
                    </Menu.Item>
                ),
                render: () =>
                    <Tab.Pane basic attached={false} >
                        <ProfileListings rides={rides} handleError={this.handleError} />
                    </Tab.Pane>
                ,
            },
            {
                menuItem: {content: "Requests Sent", key: "requests"},
                render: () => (
                    <Tab.Pane basic attached={false}>
                        <ProfileRequests userID={uid}/>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: {content: "My Profile", key: "profile"},
                render: () => (
                    <Tab.Pane basic attached={false}>
                        <ProfileDetails isEditing={isEditingProfile} vehicles={vehicles} user={user} />
                    </Tab.Pane>
                ),
            },
        ];
    
        return (
            <div className="page">
                {errorMessage && (
                    <Message
                        negative
                        floating
                        onDismiss={this.handleErrorDismiss}
                        header="Cancellation"
                        content={errorMessage}
                    />
                )}

                <Grid id="name-card" columns={3}>
                    <Grid.Column className="avatar">
                        <Image src={photoURL} size="tiny" bordered style={{ float: "right" }}/>               
                    </Grid.Column>                       
                    <Grid.Column>
                        <Header as="h2" textAlign="center">
                            {firstName + " " + lastName}
                            <Header.Subheader>{school}</Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        {/* Display the "Edit Profile" Button when "My Profile" Tab is active */
                            false && activeIndex === 2 && !isEditingProfile &&
                            <Button primary icon labelPosition="left" style={{ float: "right" }}
                                onClick={this.handleEditProfile}>
                                <Icon name="pencil alternate" />
                                Edit Profile
                            </Button>
                        }
                        {/* Display the "Save Change" Button when the user is in editing mode */
                            false && activeIndex === 2 && isEditingProfile &&
                            <div className="button-group" style={{ float: "right" }}>   
                                <Button primary
                                    onClick={this.handleSaveProfile}>
                                    Save Changes
                                </Button>
                                <Button 
                                    onClick={this.handleCancelEditing}>
                                    Cancel                           
                                </Button>
                            </div>
                        }
                    </Grid.Column>       
                </Grid>
                <div className="tab-menu">
                    <Tab
                        menu={{
                            fluid: true,
                            widths: 4,
                            secondary: true,
                            pointing: true,
                        }}
                        panes={panes}
                        activeIndex={activeIndex}
                        onTabChange={this.handleTabChange}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Profile);
