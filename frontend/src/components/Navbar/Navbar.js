import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Segment, Menu, Icon, Button } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from "../../firebase";
/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    // uid: state.uid,
});

const Navbar = (props) => {
    //TODO: add mobile layout
    /* TODO: Fix routing https://stackoverflow.com/questions/55105402/react-router-click-same-link-more-than-one-times-and-browser-back-button*/

    const { pathname } = useLocation();

    const signOut = () => {
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful.");
            props.dispatch({
                type: 'UPDATE_AUTH_STATUS',
                loggedIn: false,
                uid: "",
            });
        }).catch(function(error) {
          // An error happened
          console.log("error occurred when signing out");
          console.log(error);
        });
    };

    return (
        <Segment vertical inverted>
            {props.loggedIn ? (
                <Menu inverted secondary pointing size="large">
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            Search
                        </Menu.Item>
                    </Link>
                    <Link to="/newride">
                        <Menu.Item active={pathname === '/newride'}>
                            Create a Ride
                        </Menu.Item>
                    </Link>
                    <Link to="/profile">
                        <Menu.Item active={pathname === '/profile'}>
                            Profile <Icon name="user circle outline" />
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button onClick={signOut}>Log Out</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            ) : (
                <Menu inverted secondary pointing size="large">
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            Search
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Link to="/login">
                            <Menu.Item active={pathname === '/login'}>
                                Login / Sign Up
                            </Menu.Item>
                        </Link>
                    </Menu.Menu>
                </Menu>
            )}
        </Segment>
    );
};

export default connect(mapStateToProps)(Navbar);